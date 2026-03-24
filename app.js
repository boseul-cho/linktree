async function loadProducts() {
  const container = document.getElementById("productSections");

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
    const { sectionOrder, sectionTitles, products } = data;

    const html = sectionOrder
      .map((sectionKey) => {
        const items = products.filter((item) => item.section === sectionKey);
        if (!items.length) return "";

        const linksHtml = items
          .map(
            (item) => `
              <a class="link" href="${item.href}" target="_blank" rel="noopener noreferrer">
                <img
                  src="${item.image}"
                  class="link-thumb"
                  alt="${item.alt || item.title}"
                  loading="lazy"
                />
                <span class="link-text">${item.title}</span>
              </a>
            `
          )
          .join("");

        return `
          <section class="product-section">
            <div class="section-title"><span>${sectionTitles[sectionKey] || sectionKey}</span></div>
            <div class="links">
              ${linksHtml}
            </div>
          </section>
        `;
      })
      .join("");

    container.innerHTML = html;
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