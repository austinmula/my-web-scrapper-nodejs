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
        "https://www.indeed.com/jobs?q=remote+%24145%2C000&sc=0kf%3Aattr%28FCGTU%7CHFDVW%7CQJZM9%7CUTPWG%252COR%29explvl%28ENTRY_LEVEL%29%3B&fromage=3&vjk=85cc803206efc5cb"
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
            let posted_date = "Null"
            let job_meta = "Null"

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
            try {
                posted_date = await page.evaluate(
                    (el) => el.querySelector("table.jobCardShelfContainer.big6_visualChanges > tbody > tr.underShelfFooter > td > div > span").textContent,
                    job
                );
            } catch (error) { }
            try {
                job_meta = await page.evaluate(
                    (el) => el.querySelector(".metadata .attribute_snippet").textContent,
                    job
                );
            } catch (error) { }

            //   .metadata .attribute_snippet

            // table.jobCardShelfContainer.big6_visualChanges > tbody > tr.underShelfFooter > td > div > span

            if (job_title !== "Null") {
                fs.appendFile(
                    "results.csv",
                    `${job_title.replace(/,/g, ".")},${company_name.replace(/,/g, "-")},${company_location.replace(/,/g, ".")},${posted_date.replace(/,/g, ".")},${job_meta.replace(/,/g, ".")}\n`,
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