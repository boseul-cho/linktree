# Boseul Cho Linktree

정적 HTML/CSS/JavaScript로 만든 개인 링크 페이지입니다. Vercel에서 별도 빌드 명령 없이 배포됩니다.

## Vercel 배포

1. GitHub 저장소를 Vercel에 Import합니다.
2. **Framework Preset**은 `Other`, **Build Command**와 **Output Directory**는 비워 둡니다.
3. Deploy합니다. 이후 `main` 브랜치에 push할 때마다 Production 배포가 자동으로 갱신됩니다.
4. 커스텀 도메인을 사용할 경우 Vercel의 **Settings → Domains**에서 연결하고, DNS 안내에 따라 레코드를 설정합니다.

## Vercel Web Analytics

이 프로젝트는 순수 정적 사이트라 패키지를 설치하지 않습니다.

1. 첫 배포 후 Vercel 프로젝트의 **Analytics** 메뉴에서 **Enable**을 누릅니다.
2. Vercel이 제공하는 정적 HTML용 스니펫에서 `/<unique-path>/script.js` 경로를 확인합니다.
3. `index.html`의 `</body>` 바로 앞에 아래 코드를 추가하고 다시 배포합니다. `<unique-path>`는 2단계의 실제 값으로 바꿉니다.

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/<unique-path>/script.js"></script>
```

배포 후 Vercel Analytics 화면에서 방문·유입 경로·기기 정보를 확인할 수 있습니다. Analytics 활성화 뒤 재배포해야 전용 경로가 정상 작동합니다.

## 함께 활성화할 항목

- **Speed Insights**: 실제 방문자의 Core Web Vitals를 확인합니다. Analytics와 같은 방식으로 Vercel 대시보드에서 활성화하세요.
- **커스텀 도메인**: 프로필 링크에 기억하기 쉬운 주소를 쓰고, `www`와 루트 도메인 중 하나를 기본 도메인으로 지정하세요.
- **소셜 미리보기**: 기본 Open Graph 메타 태그와 미리보기 이미지는 포함되어 있습니다. 실제 도메인을 연결한 뒤 카카오톡·인스타그램 등에서 공유 미리보기를 확인하세요.

`vercel.json`에는 보안 응답 헤더와 이미지 장기 캐시가 설정되어 있습니다.
