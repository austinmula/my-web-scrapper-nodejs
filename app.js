const puppeteer = require("puppeteer")

const fs = require("fs");

// const sleep = (milliseconds) => {
//     return new Promise((resolve) => setTimeout(resolve, milliseconds));
// };

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        // userDataDir: "./tmp",
    });

    const page = await browser.newPage();
    // "https://www.indeed.com/jobs?q=developer&l=&vjk=e81d40560acf4695"
    await page.goto(
        "https://www.indeed.com/jobs?q=developer&from=mobRdr&l=&utm_source=%2Fm%2F&utm_medium=redir&utm_campaign=dt&vjk=2dd51799c019b82d"
    );

    // #jobsearch-JapanPage > div > div > div.jobsearch-SerpMainContent > div.jobsearch-LeftPane > nav > div > a
    let isBtnDisabled = false;
    while (!isBtnDisabled) {
        // await page.waitForSelector('[data-cel-widget="search_result_0"]');

        const jobs = await page.$$(
            `.jobsearch-ResultsList > li`
        );

        for (const job of jobs) {
            let job_title = "Null";
            let company_location = "Null";
            let company_name = "Null";

            try {
                job_title = await page.evaluate(
                    (el) => el.querySelector("h2 > a > span").textContent,
                    job
                );
            } catch (error) { }

            try {
                company_name = await page.evaluate(
                    (el) => el.querySelector(".heading6 > span").textContent,
                    job
                );
            } catch (error) { }

            try {
                company_location = await page.evaluate(
                    (el) => el.querySelector(".companyLocation > span").textContent,
                    job
                );
            } catch (error) { }

            if (job_title !== "Null") {
                fs.appendFile(
                    "results.csv",
                    `${job_title.replace(/,/g, ".")},${company_name},${company_location}\n`,
                    function (err) {
                        if (err) throw err;
                    }
                );
            }

        }


        await page.waitForSelector('nav > div > a[data-testid="pagination-page-next"]', { visible: true });
        const is_disabled = (await page.$('nav > div > a[data-testid="pagination-page-next"]')) === null;

        isBtnDisabled = is_disabled;
        if (!is_disabled) {
            await Promise.all([
                page.click('nav > div > a[data-testid="pagination-page-next"]'),
                page.waitForNavigation({ waitUntil: "networkidle2" }),
            ]);
        }
    }

    await browser.close();
})();