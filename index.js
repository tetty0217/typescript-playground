const path = require("path");
const fs = require("fs").promises;
const fse = require("fs-extra");
const { exec } = require('child_process')

const VERSIONS_DIR = path.resolve("versions")
const TEMPLATE_DIR = path.resolve("template")

async function build(version) {
    const versionDir = `${VERSIONS_DIR}/${version}`

    try {
        await fse.copySync(TEMPLATE_DIR, versionDir);
        const packageJson = require(`${versionDir}/package.json`)
        await fs.writeFile(`${versionDir}/package.json`, JSON.stringify(packageJson).replace(/VERSION/g, version));
        console.log(`Success: ${version}`)
    } catch (error) {
        console.error(`Failed: ${version}`, error);
    }
}


async function main() {
    const prev = process.argv[2];
    const next = process.argv[3];

    await build(prev);
    await build(next);

    // exec("yarn workspaces run install", (err, stdout, stderr) => {
    //     if (err) {
    //         console.error(`stderr: ${stderr}`)
    //         return
    //     }
    //     console.log(`stdout: ${stdout}`)
    // })
}

main();
