const themeStorageKey = "boseul-theme";

function setupThemeToggle() {
  const options = document.querySelectorAll(".theme-option");
  const switcher = document.querySelector(".theme-switcher");
  const themeColor = document.getElementById("themeColor");
  const swipeOverlay = document.getElementById("themeSwipeOverlay");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  const applyThemeMode = (mode, shouldPersist = false) => {
    const theme = mode === "auto" ? (systemTheme.matches ? "dark" : "light") : mode;
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.dataset.theme = theme;
    if (shouldPersist) localStorage.setItem(themeStorageKey, mode);
    if (themeColor) themeColor.content = theme === "dark" ? "#25221f" : "#f6f1e9";
    options.forEach((option) => {
      option.setAttribute("aria-pressed", String(option.dataset.themeMode === mode));
    });
  };

  applyThemeMode(document.documentElement.dataset.themeMode || "auto");
  options.forEach((option) => option.addEventListener("click", () => {
    applyThemeMode(option.dataset.themeMode, true);
  }));
  systemTheme.addEventListener("change", () => {
    if (document.documentElement.dataset.themeMode === "auto") applyThemeMode("auto");
  });

  const updateSwitcherVisibility = () => {
    switcher?.classList.toggle("is-hidden", window.scrollY > 180);
  };

  updateSwitcherVisibility();
  window.addEventListener("scroll", updateSwitcherVisibility, { passive: true });

  let swipeStart = null;
  let swipeDeltaX = 0;
  let isHorizontalSwipe = false;

  const resetSwipePreview = () => {
    swipeOverlay?.classList.remove("is-active");
    if (swipeOverlay) {
      swipeOverlay.style.removeProperty("--swipe-progress");
      swipeOverlay.style.removeProperty("--swipe-translate");
    }
  };

  document.addEventListener("touchstart", (event) => {
    if (event.target.closest("a, button, input")) return;
    const touch = event.touches[0];
    swipeStart = { x: touch.clientX, y: touch.clientY };
    swipeDeltaX = 0;
    isHorizontalSwipe = false;
  }, { passive: true });

  document.addEventListener("touchmove", (event) => {
    if (!swipeStart) return;
    const touch = event.touches[0];
    const deltaY = touch.clientY - swipeStart.y;
    swipeDeltaX = touch.clientX - swipeStart.x;

    if (!isHorizontalSwipe && Math.abs(swipeDeltaX) > 14 && Math.abs(swipeDeltaX) > Math.abs(deltaY) * 1.3) {
      isHorizontalSwipe = true;
    }
    if (!isHorizontalSwipe) return;

    const targetTheme = swipeDeltaX < 0 ? "dark" : "light";
    const progress = Math.min(Math.abs(swipeDeltaX) / 150, 1);
    swipeOverlay.dataset.targetTheme = targetTheme;
    swipeOverlay.style.setProperty("--swipe-progress", progress);
    swipeOverlay.style.setProperty("--swipe-translate", `${targetTheme === "dark" ? -70 + progress * 70 : 70 - progress * 70}%`);
    swipeOverlay.classList.add("is-active");
  }, { passive: true });

  const finishSwipe = () => {
    if (isHorizontalSwipe && Math.abs(swipeDeltaX) >= 72) {
      applyThemeMode(swipeDeltaX < 0 ? "dark" : "light", true);
    }
    resetSwipePreview();
    swipeStart = null;
  };

  document.addEventListener("touchend", finishSwipe, { passive: true });
  document.addEventListener("touchcancel", finishSwipe, { passive: true });
}

async function loadProducts() {
  const container = document.getElementById("productSections");
  const searchInput = document.getElementById("productSearch");
  const clearSearchButton = document.getElementById("clearSearch");
  const searchSummary = document.getElementById("searchSummary");

  if (!container) {
    console.error("productSections 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const response = await fetch("./products.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`products.json 불러오기 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const { products } = data;
    const numberedProducts = products;

    const renderProducts = (query = "") => {
      const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
      const matches = (item) => {
        if (!normalizedQuery) return true;

        if (/^\d+$/.test(normalizedQuery)) {
          return String(item.number) === normalizedQuery;
        }

        const searchableText = [
          item.title,
          item.note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase("ko-KR");

        return searchableText.includes(normalizedQuery);
      };

      const visibleItems = numberedProducts.filter(matches);
      const linksHtml = visibleItems
        .map(
          (item) => `
            <a class="link" href="${item.href}" target="_blank" rel="noopener noreferrer">
              <span class="link-index" aria-label="아이템 번호 ${item.number}">${item.number}</span>
              <img
                src="${item.image}"
                class="link-thumb"
                alt="${item.alt || item.title}"
                loading="lazy"
              />
              <span class="link-content">
                <span class="link-text">${item.title}</span>
                ${item.note ? `<span class="link-note">${item.note}</span>` : ""}
              </span>
            </a>
          `
        )
        .join("");

      container.innerHTML = linksHtml ? `<div class="links">${linksHtml}</div>` : `
        <div class="empty-search" role="status">
          <span>찾으시는 아이템이 없어요.</span>
          <small>다른 이름이나 번호로 다시 찾아보세요.</small>
        </div>
      `;

      if (searchSummary) {
        searchSummary.textContent = normalizedQuery
          ? `“${query.trim()}” 검색 결과 ${visibleItems.length}개`
          : `${numberedProducts.length}개의 큐레이션 아이템`;
      }
    };

    renderProducts();

    searchInput?.addEventListener("input", (event) => {
      const query = event.target.value;
      clearSearchButton.hidden = !query;
      renderProducts(query);
    });

    clearSearchButton?.addEventListener("click", () => {
      searchInput.value = "";
      clearSearchButton.hidden = true;
      renderProducts();
      searchInput.focus();
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = `
      <div class="links">
        <div class="link" style="pointer-events:none;">
          <span class="link-text">상품 업데이트 중.</span>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  loadProducts();
});
