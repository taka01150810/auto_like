const numElements = 10000;

for (let i = 2; i <= numElements + 1; i++) {
  const selector = `#matchableUsers > div:nth-child(${i}) > div > a`;

  const element = await page.$(selector);
  if (element) {
    let onclickValue = await page.evaluate(
      (el) => el.getAttribute("onclick"),
      element
    );
    let match = /profile_open\((\d+)\);return\(false\);/.exec(onclickValue);
    let profileId = match[1];
    let intProfileID = parseInt(profileId);

    const openProfileAndClick = async (profileId) => {
      profile_open(profileId);
      return false;
    };

    await page.evaluate(openProfileAndClick, intProfileID);

    await page.waitFor(500);

    const postLikeScript = `post_like(${profileId});return(false);`;

    await page.evaluate((script) => {
      const element = document.querySelector(`a[onclick="${script}"]`);
      if (element) {
        element.click();
      }
    }, postLikeScript);

    await page.waitFor(500);

    await page.evaluate(() => {
      const element = document.querySelector(
        'a[onclick="profile_close();return(false);"]'
      );
      if (element) {
        element.click();
      }
    });

    // ページをスクロール
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight); // 1画面分スクロール
    });

    await page.waitFor(500);
  }
}
