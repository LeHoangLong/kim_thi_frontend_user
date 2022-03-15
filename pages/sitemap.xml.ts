import React from "react";
import fs from 'fs';
import path from 'path';
import container from '../container'
import { IProductRepositories } from "../repositories/IProductRepositories";
import Symbols from "../config/Symbols";

const Sitemap = () => {};

function getFiles(dir) : string[] {
    const subdirs = fs.readdirSync(dir);
    let files : string[] = []
    subdirs.forEach((subdir) => {
        let joinedPath = path.join(dir, subdir)
        fs.statSync(joinedPath).isDirectory() ? 
            files = files.concat(getFiles(joinedPath)) : 
            files.push(subdir);

    });
    let filtered = files.filter((f) => (
            f.includes('ts') || 
            f.includes('js')
        ) && !f.includes('[') && !f.includes('.xml')
    );
    return filtered
}

export const getServerSideProps = async ({ res }) => {
    const baseUrl = process.env.NEXT_URL;
    
    const staticPages = getFiles("pages")
    .filter((staticPage) => {
        return ![
        "_app.js",
        "_document.js",
        "_error.js",
        "sitemap.xml.ts",
        "index.tsx"
        ].includes(staticPage) && (staticPage.includes('ts') || staticPage.includes('js'));
    })
    .map((staticPagePath) => {
        return `${baseUrl}/${staticPagePath.split('.')[0]}`;
    });

    let productRepositories = container.get<IProductRepositories>(Symbols.PRODUCT_REPOSITORY)
    let productCount = await productRepositories.getNumberOfProducts({
        categories: [],
        productSearch: '',
    })
    let productSummaries = await productRepositories.getProductSummaries({
        categories: [],
        limit: productCount,
        offset: 0,
        productSearch: '',
    })

    let pages = productSummaries.reduce((a, p) => a.concat(`${baseUrl}/products/${p.id}`), staticPages)

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${baseUrl}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
        ${pages
        .map((url) => {
            return `
            <url>
                <loc>${url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>1.0</priority>
            </url>
            `;
        })
        .join("")}
    </urlset>
    `;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();
  
    return {
      props: {},
    };
  };
  

export default Sitemap;