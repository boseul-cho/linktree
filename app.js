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

document.addEventListener("DOMContentLoaded", loadProducts);
