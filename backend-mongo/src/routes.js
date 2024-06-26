const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = express.Router();
const { GridFSBucket, MongoClient } = require('mongodb');
const mongodb = require('mongodb')
const multer = require('multer');
const mongoClient = mongodb.mongoClient
const ObjectId = mongodb.ObjectId
const { GridFSBucketReadStream, GridFSBucketWriteStream } = require('mongodb');
const { Readable } = require('stream');
const path = require('path');
const bcrypt = require('bcrypt');

const fs = require('fs')

const app = require('./index');

const expressFormidable = require('express-formidable')
const client = new MongoClient('mongodb+srv://kaique_:NvTLWlJGFZ7mTaPv@cluster0.tu35bqx.mongodb.net/?retryWrites=true&w=majority');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, (new Date().getTime()) + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


// -------------------- Modelos para o BD --------------------

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    office: { type: String, required: true },
    company: { type: String, required: true },
});

employeeSchema.pre('save', async function (next) {
    const employee = this;
    if (!employee.isModified('password')) return next();

    try {
        const hashedPassword = await bcrypt.hash(employee.password, 10);
        employee.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

employeeSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

const Employee = mongoose.model('Employee', employeeSchema);

const Company = mongoose.model('company', {
    name: String,
    email: String
})

const patenteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    dataEntrada:{
        type: String,
        required: true
    },
    codigoAutomatico: {
        type: String,
        required: false
    },
    resumo: {
        type: String,
        required: true
    },
    pdfDocument: {
        data: Buffer,
        contentType: String
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId, // Tipo para armazenar IDs do MongoDB
        ref: 'Employee', // Referência ao modelo de Employee, ajuste conforme necessário
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId, // Tipo para armazenar IDs do MongoDB
        ref: 'Company', // Referência ao modelo de Employee, ajuste conforme necessário
        required: true
    }
});

const Patente = mongoose.model('Patente', patenteSchema);

const documentoProcessoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    pdfDocument: {
        data: Buffer,
        contentType: String
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId, // Tipo para armazenar IDs do MongoDB
        ref: 'Employee', // Referência ao modelo de Employee, ajuste conforme necessário
        required: true
    },
    patenteId: {
        type: mongoose.Schema.Types.ObjectId, // Tipo para armazenar IDs do MongoDB
        ref: 'Patente', // Referência ao modelo de Processo
        required: true
    }
})

const DocumentoProcesso = mongoose.model('DocumentoProcesso', documentoProcessoSchema)

module.exports = Patente;


// -------------------- ROTAS PARA AS EMPRESAS --------------------

// Rota para Criação de Empresas
routes.post("/createCompany", async (req, res) => {

    try{
        const userEmail = await Company.findOne({email: req.body.email})

        if (!(userEmail)) {
            const { name, email } = req.body;

            const company = new Company({
                name: name,
                email: email
            })
            await company.save()
            return res.send(company)
        }

        return res.send('Email já cadastrado')
    } catch (error){
        return res.status(500).json({ error: 'Erro ao criar Empresa', details: error.message });
    }
})

// Rota para Pesquisa (get) de todas as Empresas
routes.get("/companies", async (req, res) => {
    try{
        const company = await Company.find()
        return res.send(company)
    } catch (error){
        return res.status(500).json({ error: 'Erro ao buscar Empresas', details: error.message });
    }
})

// Rota para Pesquisa (get) de um Empresa por id
routes.get("/company/:id", async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
        return res.send(company)
    }catch (error){
        return res.status(500).json({ error: 'Erro ao buscar Empresa', details: error.message });
    }
})

// Rota para Alteração (update) da Empresa
routes.put("/company/:id", async (req, res) => {

    try {
        const userId = Company.findOne({id: req.params.id})

        if (userId) {
            const { name, email } = req.body;

            const company = await Company.findByIdAndUpdate(req.params.id, {
                name: name,
                email: email
    })

    return res.send(company)
    }
    return res.send('Empresa não encontrado')

    } catch (error){
        return res.status(500).json({ error: 'Erro ao alterar dados da Empresa', details: error.message });
    }    
})

// -------------------- ROTAS PARA OS FUNCIONÁRIOS --------------------

const saltRounds = 10; // número de rounds de hash

// Rota para Criação de Funcionários
routes.post("/createEmployee", async (req, res) => {
    try {
        const userEmail = await Employee.findOne({email: req.body.email.toLowerCase()});

        if (!userEmail) {
            const { name, email, password, office, company } = req.body;

            const employee = new Employee({
                  name: name,
                email: email.toLowerCase(),
                password: password, // bcrypt.hash Automatic
                office: office,
                company: company
            });

            await employee.save();
            return res.send(employee);
        }

        return res.send('Email já cadastrado');
    } catch (error){
        return res.status(500).json({ error: 'Erro ao criar funcionário', details: error.message });
    }
});

// Rota para fazer login
routes.post("/login", async (req, res) => {
    console.log('hi')
    try {
        const { email, password } = req.body;

        // Verificar se o email existe no banco de dados
        const employee = await Employee.findOne({ email: email.toLowerCase() });

        const hashedPassword = await bcrypt.hash(password, saltRounds);


        if (employee) {
            // Comparar a senha fornecida com o hash da senha armazenado no banco de dados
            const isPasswordCorrect = bcrypt.compareSync(password, employee.password);

            if (isPasswordCorrect) {
                // Senha correta, retornar os dados do usuário
                console.log(employee)
                return res.send(employee);
            } else {
                // Senha incorreta
                return res.status(401).send('Senha incorreta');
            }
        } else {
            // Usuário não encontrado
            return res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
    }
});

// Rota para pesquisa de nome do funcionário por id
routes.post("/searchNomeId", async (req, res) => {
    try {
        const { employeeId } = req.body
        const employee = await Employee.findById(employeeId)

        const name = employee.name
        return res.send(name)
    }catch (error){
        return res.status(500).json({ error: 'Erro ao buscar funcionário', details: error.message });
    }
})


// Rota para Pesquisa (get) de todos os Funcionários
routes.post("/searchEmployees", async (req, res) => {
    try {
        const { companyId } = req.body; // Modificado para companyId

        const employees = await Employee.find({ company: companyId }); // Modificado para companyId

        if (employees.length > 0) {
            return res.send(employees);
        } else {
            return res.status(404).send("Nenhum funcionário encontrado para esta empresa");
        }
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar funcionários", details: error.message });
    }
});


// Rota para Pesquisa (get) de um Funcionário por id
routes.get("/buscarFuncionario/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        return res.send(employee)
    }catch (error){
        return res.status(500).json({ error: 'Erro ao buscar funcionário', details: error.message });
    }
})

// Rota para Alteração (update) do usuário
routes.put("/employee/:id", async (req, res) => {
    try {
        const userId = await Employee.findById(req.params.id);

        if (userId) {
            const { name, email, password, office } = req.body;

            // Se a senha for fornecida na atualização, precisamos hashá-la antes de salvar
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                req.body.password = hashedPassword;
            }

            const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });

            return res.send(updatedEmployee);
        }
        
        return res.status(404).send('Funcionário não encontrado');
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao alterar dados do funcionário', details: error.message });
    }    
});


// Rota para Deleção de Usuários
routes.delete("/:id", async (req, res) => {
    try{
        const employee = await Employee.findByIdAndDelete(req.params.id)
        return res.send(employee)
    } catch (error){
        return res.status(500).json({error : 'Erro ao excluir funcionário', details: error.message})
    }
})

// -------------------- ROTAS PARA AS PATENTES --------------------

// Rota para criação de patentes
routes.post("/uploadPatente", upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const { employeeId, nomePatente, tipo, dataEntrada, codigoAutomatico, resumo, status, companyId } = req.body;

        if (!employeeId) {
            return res.status(400).json({ error: 'Employee ID not provided' });
        }

        if (!nomePatente || !tipo || !dataEntrada || !resumo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Read file data asynchronously
        const fileData = fs.readFileSync(file.path);

        // Create an instance of the Patente model with the new schema
        const newPatente = new Patente({
            name: nomePatente,
            tipo: tipo,
            status: status,
            dataEntrada: dataEntrada,
            codigoAutomatico: codigoAutomatico,
            resumo: resumo,
            pdfDocument: {
                data: fileData, // Assign file data directly
                contentType: file.mimetype
            },
            employeeId: employeeId,
            companyId: companyId
        });

        // Save the instance to the "patente" collection
        await newPatente.save();

        // Delete the file from the "uploads" folder after saving it to the database
        fs.unlinkSync(file.path); // Delete the file

        res.send('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Método POST para buscar patente por ID
routes.post("/buscarPorIdPatente", async (req, res) => {
    try {
        // Obtenha o ID da patente do corpo da solicitação
        const patenteId = req.body.patenteId;

        // Verifique se o ID da patente foi fornecido
        if (!patenteId) {
            return res.status(400).json({ error: 'ID da patente é obrigatório' });
        }

        // Use o método findById do modelo Patente para buscar a patente pelo ID
        const patente = await Patente.findById(patenteId);

        // Se a patente não for encontrada, retorne um erro
        if (!patente) {
            return res.status(404).json({ error: 'Patente não encontrada' });
        }

        // Se a patente for encontrada, retorne-a como resposta
        res.json(patente);
    } catch (error) {
        // Se ocorrer um erro durante a busca da patente, retorne um erro interno do servidor
        console.error('Erro ao buscar patente por ID:', error);
        res.status(500).json({ error: 'Erro ao buscar patente por ID', details: error.message });
    }
});

// Rota para buscar patente id da patente
routes.post("/buscarPorIdPatente", async (req, res) => {
    try {
        const patenteId = req.body.patenteId;

        if (!patenteId) {
            return res.status(400).json({ error: 'Id da patente não encontrado' });
        }

        // Busca a patente pelo nome e ID do funcionário
        const patente = await Patente.findOne({ id: patenteId });

        if (!patente) {
            return res.status(404).json({ error: 'Patente não encontrada' });
        }

        res.json(patente);
    } catch (error) {
        console.error('Error searching for patent:', error);
        res.status(500).json({ error: 'Erro ao buscar patente', details: error.message });
    }
});

// Rota para buscar patente por nome e id do funcionário
routes.get("/buscarPorNomeEFuncionario", async (req, res) => {
    try {
        const nome = req.body.nome;
        const employeeId = req.body.employeeId;

        if (!nome || !employeeId) {
            return res.status(400).json({ error: 'Nome e ID do funcionário são obrigatórios' });
        }

        // Busca a patente pelo nome e ID do funcionário
        const patente = await Patente.findOne({ name: nome, employeeId: employeeId });

        if (!patente) {
            return res.status(404).json({ error: 'Patente não encontrada' });
        }

        res.json(patente);
    } catch (error) {
        console.error('Error searching for patent:', error);
        res.status(500).json({ error: 'Erro ao buscar patente', details: error.message });
    }
});

// Rota para buscar patente por id do funcionário
routes.post("/buscarPorIdFuncionario", async (req, res) => {
    try {
        const employeeId = req.body.employeeId;

        if (!employeeId) {
            return res.status(400).json({ error: 'ID do funcionário é obrigatório' });
        }

        const patentes = await Patente.find({ employeeId: employeeId });

        if (!patentes || patentes.length === 0) {
            return res.status(404).json({ error: 'Patentes não encontradas para este funcionário' });
        }

        res.json(patentes);
    } catch (error) {
        console.error('Erro ao buscar patentes por funcionário:', error);
        res.status(500).json({ error: 'Erro ao buscar patentes por funcionário', details: error.message });
    }
});

// Rota para buscar patentes em andamento por id do funcionário
routes.post("/buscarEmAndamentoPorIdFuncionario", async (req, res) => {
    try {
        const employeeId = req.body.employeeId;

        if (!employeeId) {
            return res.status(400).json({ error: 'ID do funcionário é obrigatório' });
        }

        const patentes = await Patente.find({ employeeId: employeeId, status: 'Em andamento' });

        if (!patentes || patentes.length === 0) {
            return res.status(404).json({ error: 'Patentes não encontradas para este funcionário com status "Em andamento"' });
        }

        res.json(patentes);
    } catch (error) {
        console.error('Erro ao buscar patentes por funcionário:', error);
        res.status(500).json({ error: 'Erro ao buscar patentes por funcionário', details: error.message });
    }
});

// Rota para buscar patentes em andamento por id do funcionário
routes.post("/buscarEmAndamentoPorIdEmpresa", async (req, res) => {
    try {
        const companyId = req.body.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'ID do funcionário é obrigatório' });
        }

        const patentes = await Patente.find({ companyId: companyId, status: 'Em andamento' });

        if (!patentes || patentes.length === 0) {
            return res.status(404).json({ error: 'Patentes não encontradas para este funcionário com status "Em andamento"' });
        }

        res.json(patentes);
    } catch (error) {
        console.error('Erro ao buscar patentes por funcionário:', error);
        res.status(500).json({ error: 'Erro ao buscar patentes por funcionário', details: error.message });
    }
});    

// Rota para buscar patentes encerradas por id do funcionário
routes.post("/buscarEncerradoPorIdFuncionario", async (req, res) => {
    try {
        const employeeId = req.body.employeeId;

        if (!employeeId) {
            return res.status(400).json({ error: 'ID do funcionário é obrigatório' });
        }

        const patentes = await Patente.find({ employeeId: employeeId, status: 'Encerrado' });

        if (!patentes || patentes.length === 0) {
            return res.status(404).json({ error: 'Patentes não encontradas para este funcionário com status "Em andamento"' });
        }

        res.json(patentes);
    } catch (error) {
        console.error('Erro ao buscar patentes por funcionário:', error);
        res.status(500).json({ error: 'Erro ao buscar patentes por funcionário', details: error.message });
    }
});

// Rota para buscar patentes encerradas por id da empresa
routes.post("/buscarEncerradoPorIdEmpresa", async (req, res) => {
    try {
        const companyId = req.body.companyId;

        if (!companyId) {
            return res.status(400).json({ error: 'ID do funcionário é obrigatório' });
        }

        const patentes = await Patente.find({ companyId: companyId, status: 'Encerrado' });

        if (!patentes || patentes.length === 0) {
            return res.status(404).json({ error: 'Patentes não encontradas para este funcionário com status "Em andamento"' });
        }

        res.json(patentes);
    } catch (error) {
        console.error('Erro ao buscar patentes por funcionário:', error);
        res.status(500).json({ error: 'Erro ao buscar patentes por funcionário', details: error.message });
    }
});  

// Rota para recuperar arquivo PDF de uma patente
routes.get("/getPdf/:id", async (req, res) => {
    const patenteId = req.params.id;

    try {
        // Verificar se o ID da patente é válido
        if (!mongoose.Types.ObjectId.isValid(patenteId)) {
            return res.status(400).json({ error: 'Invalid patente ID' });
        }

        // Encontrar a patente pelo ID
        const patente = await Patente.findById(patenteId);

        // Verificar se a patente existe
        if (!patente) {
            return res.status(404).json({ error: 'Patente not found' });
        }

        // Verificar se a patente possui um documento PDF
        if (!patente.pdfDocument || !patente.pdfDocument.data) {
            return res.status(404).json({ error: 'PDF document not found for this patente' });
        }

        // Definir o tipo de conteúdo da resposta como PDF
        res.contentType(patente.pdfDocument.contentType);

        // Enviar o arquivo PDF como resposta
        res.send(patente.pdfDocument.data);
    } catch (error) {
        console.error('Error retrieving PDF document:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Rota para atualização de patentes
routes.post("/updatePatente/:id", upload.single('file'), async (req, res) => {
    const fileId = req.file; // Verifique se um arquivo foi enviado
    const patenteId = req.params.id; // Obtenha o ID da patente a ser atualizada

    try {
        // Verifique se o ID da patente é válido
        if (!mongoose.Types.ObjectId.isValid(patenteId)) {
            return res.status(400).json({ error: 'Invalid patente ID' });
        }

        // Encontre a patente pelo ID
        const patente = await Patente.findById(patenteId);

        // Verifique se a patente existe
        if (!patente) {
            return res.status(404).json({ error: 'Patente not found' });
        }

        // Obtenha os dados atualizados do corpo da solicitação
        const { nomePatente, tipo, dataEntrada, codigoAutomatico, resumo, status, companyId } = req.body;

        // Atualize os campos da patente, se necessário
        if (nomePatente) patente.name = nomePatente;
        if (tipo) patente.tipo = tipo;
        if (dataEntrada) patente.dataEntrada = dataEntrada;
        if (codigoAutomatico) patente.codigoAutomatico = codigoAutomatico;
        if (resumo) patente.resumo = resumo;
        if (status) patente.status = status;
        if (companyId) patente.companyId = companyId;
        if (fileId) {
            // Se um novo arquivo for enviado, atualize os dados do arquivo
            patente.pdfDocument = {
                data: fileId.buffer,
                contentType: fileId.mimetype
            };
        }

        // Salve a patente atualizada no banco de dados
        await patente.save();

        res.json({ message: 'Patente updated successfully' });
    } catch (error) {
        console.error('Error updating patente:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Rota para encerrar uma patente
routes.post("/encerrarPatente/:id", async (req, res) => {
    const patenteId = req.params.id; // Obtenha o ID da patente a ser encerrada

    try {
        // Verifique se o ID da patente é válido
        if (!mongoose.Types.ObjectId.isValid(patenteId)) {
            return res.status(400).json({ error: 'Invalid patente ID' });
        }

        // Encontre a patente pelo ID
        const patente = await Patente.findById(patenteId);

        // Verifique se a patente existe
        if (!patente) {
            return res.status(404).json({ error: 'Patente not found' });
        }

        // Atualize o status da patente para "Encerrado"
        patente.status = 'Encerrado';

        // Salve a patente atualizada no banco de dados
        await patente.save();

        res.json({ message: 'Patente encerrada successfully' });
    } catch (error) {
        console.error('Error encerrando patente:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Rota para deleção de uma patente por _id e employeeId
routes.delete("/deleteByIdAndEmployeeId", async (req, res) => {
    try {
        const { _id, employeeId } = req.body;

        if (!_id || !employeeId) {
            return res.status(400).json({ error: '_id and employee ID are required' });
        }

        // Deleta a patente com o _id e ID do funcionário fornecidos
        await Patente.deleteOne({ _id: _id, employeeId: employeeId });

        res.send('Patent deleted successfully');
    } catch (error) {
        console.error('Error deleting patent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// -------------------- ROTAS PARA OS DOCUMENTOS --------------------

// Rota para criação de documentos do processo
routes.post("/uploadDocumento", upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        const { name, data, employeeId, patenteId } = req.body;

        if (!name || !data || !employeeId || !patenteId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let pdfDocument = null;

        // Verifique se um arquivo foi enviado
        if (file) {
            // Read file data asynchronously
            const fileData = fs.readFileSync(file.path);
            
            pdfDocument = {
                data: fileData, // Armazene o conteúdo do arquivo diretamente
                contentType: file.mimetype // Defina o tipo de conteúdo
            };
            // Delete o arquivo da pasta "uploads" após salvá-lo no banco de dados
            fs.unlinkSync(file.path);
        }

        // Crie uma instância do modelo DocumentoProcesso
        const newDocumento = new DocumentoProcesso({
            name: name,
            data: data,
            pdfDocument: pdfDocument ? pdfDocument : { contentType: 'application/pdf' }, // Se não houver arquivo, apenas defina o tipo de conteúdo
            employeeId: new mongoose.Types.ObjectId(employeeId),
            patenteId: new mongoose.Types.ObjectId(patenteId)
        });

        // Salve a instância na coleção "documentosProcesso"
        await newDocumento.save();

        res.status(200).json({ message: 'Documento criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar documento:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Rota para buscar Documentos pelo id da patente e retornar apenas o arquivo PDF
routes.post("/buscarDocumentosPorPatente/:idPatente", async (req, res) => {
    try {
        const idPatente = req.params.idPatente;

        if (!idPatente) {
            return res.status(400).json({ error: 'ID da patente é obrigatório' });
        }

        const documentos = await DocumentoProcesso.find({ patenteId: idPatente });

        if (!documentos || documentos.length === 0) {
            return res.status(404).json({ error: 'Documentos de processo não encontrados para esta patente' });
        }

        res.json(documentos);
    } catch (error) {
        console.error('Erro ao buscar documentos de processo por patente:', error);
        res.status(500).json({ error: 'Erro ao buscar documentos de processo por patente', details: error.message });
    }
});

// Rota para buscar Documentos pelo id da patente e retornar apenas o arquivo PDF
routes.post("/buscarArquivoPorPatente/:idPatente", async (req, res) => {
    try {
        const idPatente = req.params.idPatente;

        if (!idPatente) {
            return res.status(400).json({ error: 'ID da patente é obrigatório' });
        }

        const documento = await DocumentoProcesso.findOne({ patenteId: idPatente });

        if (!documento) {
            return res.status(404).json({ error: 'Documento de processo não encontrado para esta patente' });
        }

        console.log(documento)
        // Retorna apenas o arquivo PDF
        res.contentType(documento.pdfDocument.contentType);
        res.send(documento.pdfDocument.data);
    } catch (error) {
        console.error('Erro ao buscar documento de processo por patente:', error);
        res.status(500).json({ error: 'Erro ao buscar documento de processo por patente', details: error.message });
    }
});


module.exports = routes;