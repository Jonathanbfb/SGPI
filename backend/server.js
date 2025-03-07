const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { Builder, By, until } = require("selenium-webdriver");

const app = express();
app.use(cors());
app.use(express.json());

// 📌 Configurar conexão com MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "10203040",
    database: "patentes_db"
});

db.connect(err => {
    if (err) console.error("❌ Erro ao conectar ao banco:", err);
    else console.log("✅ Conectado ao MySQL!");
});

// 📌 Função para buscar patentes no INPI seguindo todas as páginas
const buscarPatentes = async (termoBusca) => {
    console.log(`🔍 Buscando patentes para: ${termoBusca}`);
    let driver = await new Builder().forBrowser("chrome").build();
    let patentes = [];

    try {
        // 📌 1️⃣ Acessar a página inicial do INPI
        await driver.get("https://busca.inpi.gov.br/pePI/");
        console.log("✅ Página inicial acessada!");

        // 📌 2️⃣ Acessar a página de login (não precisa autenticar)
        await driver.get("https://busca.inpi.gov.br/pePI/servlet/LoginController?action=login");
        console.log("🔑 Página de login acessada!");

        // 📌 3️⃣ Acessar a página de pesquisa de patentes
        await driver.get("https://busca.inpi.gov.br/pePI/jsp/patentes/PatenteSearchBasico.jsp");
        console.log("🔍 Página de pesquisa acessada!");

        // 📌 4️⃣ Preencher campo de pesquisa com o termo digitado no frontend
        let campo_pesquisa = await driver.wait(until.elementLocated(By.name("ExpressaoPesquisa")), 10000);
        await campo_pesquisa.sendKeys(termoBusca);
        console.log(`✍️ Campo de pesquisa preenchido com: ${termoBusca}`);

        // 📌 5️⃣ Selecionar tipo de busca
        let select = await driver.wait(until.elementLocated(By.name("FormaPesquisa")), 5000);
        await select.sendKeys("todas as palavras");
        console.log("📌 Tipo de busca selecionado!");

        // 📌 6️⃣ Clicar no botão de pesquisa
        let botao_pesquisa = await driver.wait(until.elementLocated(By.name("botao")), 5000);
        await botao_pesquisa.click();
        console.log("▶️ Botão de pesquisa clicado!");

        // 📌 7️⃣ Aguardar carregamento
        await driver.sleep(5000);

        // 📌 8️⃣ Extrair lista de patentes
        let rows = await driver.findElements(By.xpath("//tr[@bgcolor='#E0E0E0' or @bgcolor='white']"));

        for (let row of rows) {
            let cols = await row.findElements(By.tagName("td"));
            if (cols.length >= 3) {
                let numero = await cols[0].getText();
                let titulo = await cols[2].getText();

                let linkElement = await cols[0].findElement(By.tagName("a"));
                let link = await linkElement.getAttribute("href");

                // 📌 9️⃣ Acessar a página da patente para coletar os 10 campos detalhados
                await driver.get(link);
                await driver.sleep(5000);

                const getCampo = async (texto) => {
                    try {
                        let element = await driver.findElement(By.xpath(`//*[contains(text(), '${texto}')]/following-sibling::td`));
                        return await element.getText();
                    } catch {
                        return "N/A";
                    }
                };

                let data_deposito = await getCampo("(22) Data do Depósito:");
                let data_publicacao = await getCampo("(43) Data da Publicação:");
                let data_concessao = await getCampo("(47) Data da Concessão:");
                let classificacao_ipc = await getCampo("(51) Classificação IPC:");
                let classificacao_cpc = await getCampo("(52) Classificação CPC:");
                let resumo = await getCampo("(57) Resumo:");
                let depositante = await getCampo("(71) Nome do Depositante:");
                let inventor = await getCampo("(72) Nome do Inventor:");

                patentes.push({ 
                    numero, data_deposito, data_publicacao, data_concessao, 
                    classificacao_ipc, classificacao_cpc, titulo, resumo, 
                    depositante, inventor
                });

                // 📌 Voltar para a lista de resultados antes de acessar outra página
                await driver.navigate().back();
                await driver.sleep(3000);
            }
        }

        console.log(`📄 ${patentes.length} patentes encontradas!`);

    } catch (error) {
        console.error("❌ Erro no Web Scraper:", error);
    } finally {
        await driver.quit();
    }

    return patentes;
};

// 📌 Rota para buscar patentes
app.post("/buscar", async (req, res) => {
    const { termo } = req.body;
    if (!termo) {
        return res.status(400).json({ error: "Termo de busca não fornecido!" });
    }

    const patentes = await buscarPatentes(termo);
    res.json(patentes);
});

// 📌 Rota para salvar as patentes no banco
app.post("/salvar-patentes", async (req, res) => {
    const { patentes } = req.body;

    if (!patentes || patentes.length === 0) {
        return res.status(400).json({ error: "Nenhuma patente para salvar!" });
    }

    const sql = `
        INSERT INTO patentes (numero, data_deposito, data_publicacao, data_concessao, classificacao_ipc, classificacao_cpc, titulo, resumo, depositante, inventor)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (let p of patentes) {
        db.query(sql, [
            p.numero, p.data_deposito, p.data_publicacao, p.data_concessao, 
            p.classificacao_ipc, p.classificacao_cpc, p.titulo, p.resumo, 
            p.depositante, p.inventor
        ], (err) => {
            if (err) console.error("Erro ao salvar:", err);
        });
    }

    res.json({ message: "✅ Patentes salvas no banco!" });
});

// 🔥 Iniciar servidor
app.listen(5000, () => console.log("🚀 Backend rodando na porta 5000"));
