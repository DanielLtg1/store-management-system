// Importing necessary modules and configurations
import 'dotenv/config';
import connection from './database/connection.js';
import express from 'express';
import cors from 'cors';

const app = express(); // Create an Express application
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// ATTENDANTS ROUTES
//Create a new attendant
app.post('/atendentes', async (req, res) => {
    try {
        const {nome, senha_hash} = req.body;

        if (!nome || !senha_hash) {
            return res.status(400).json({ success: false, error: 'Nome e senha são obrigatórios!' });
        }
        await connection.execute(
            "INSERT INTO atendente (nome, senha_hash) VALUES (?, ?)",
            [nome, senha_hash]
        )
        res.status(201).json({ success: true, message: 'Atendente criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar atendente:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Get all attendants
app.get('/atendentes', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT id, nome FROM atendente WHERE ativo = 1"
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Erro ao buscar atendentes:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });

    }
});

// Get an attendant by ID
app.get('/atendentes/:id', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT id, nome FROM atendente WHERE id = ? AND ativo = 1",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Atendente não encontrado' });
        }
        res.status(200).json({success: true, data: rows[0]});
    } catch (error) {
        console.error('Erro ao buscar atendente:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Update an attendant by ID
app.put('/atendentes/:id', async (req, res) => {
    try {
        const {nome, senha_hash} = req.body;

        if (!nome || !senha_hash) {
            return res.status(400).json({ success: false, error: 'Nome e senha são obrigatórios!' });
        }
        await connection.execute(
            "UPDATE atendente SET nome = ?, senha_hash = ? WHERE id = ? AND ativo = 1",
            [nome, senha_hash, req.params.id]
        );
        res.status(200).json({success: true, message: 'Atendente atualizado com sucesso!' });
    } catch(error) {
        console.error('Erro ao atualizar atendente:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
        
    
});

// "Delete" (disable) an attendant by ID
app.delete('/atendentes/:id', async (req, res) => {
    try {
        await connection.execute(
            "UPDATE atendente SET ativo = 0 WHERE id = ? AND ativo = 1",
            [req.params.id]
        )
        res.status(200).json({success: true, message: 'Atendente removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover atendente:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// PRODUCTS ROUTES
//Create a new clothing item
app.post('/produtos/roupas', async (req, res) => {
    try {
        const {nome, tamanho, genero, preco, quantidade} = req.body;

        if (!nome || !tamanho || !genero || !preco || !quantidade) {
            return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios!' });
        }
        await connection.execute(
            "INSERT INTO produto_roupa (nome, tamanho, genero, preco, quantidade) VALUES (?, ?, ?, ?, ?)",
            [nome, tamanho, genero, preco, quantidade]
        );
        res.status(201).json({ success: true, message: 'Produto de roupa criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar produto de roupa:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Get all clothing items
app.get('/produtos/roupas', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT id, nome, tamanho, genero, preco, quantidade FROM produto_roupa WHERE ativo = 1"
        );
        res.status(200).json({success: true, data: rows});
    } catch (error) {
        console.error('Erro ao buscar produtos de roupa:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Get a clothing item by ID
app.get('/produtos/roupas/:id', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT id, nome, tamanho, genero, preco, quantidade FROM produto_roupa WHERE id = ? AND ativo = 1",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Produto não encontrado' })
        }
        res.status(200).json({success: true, data: rows[0]});
    } catch (error) {
        console.error('Erro ao buscar produto de roupa:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Update a clothing item by ID
app.put('/produtos/roupas/:id', async (req, res) => {
    try {
        const {nome, tamanho, genero, preco, quantidade} = req.body;

        if (!nome || !tamanho || !genero || !preco || !quantidade) {
            return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios!' });
        }
        await connection.execute(
            "UPDATE produto_roupa SET nome = ?, tamanho = ?, genero = ?, preco = ?, quantidade = ? WHERE id = ? AND ativo = 1",
            [nome, tamanho, genero, preco, quantidade, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Produto de roupa atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar produto de roupa:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update clothing item quantity for stock entry
app.patch('/produtos/roupas/:id/entrada', async (req, res) => {
    const {quantidade} = req.body;
    if (!quantidade) {
        return res.status(400).json({ success: false, error: 'Quantidade é obrigatória!' });
    }
    try {
        await connection.execute(
            "UPDATE produto_roupa SET quantidade = quantidade + ? WHERE id = ? AND ativo = 1",
            [quantidade, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Quantidade de produto de roupa atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar quantidade de produto de roupa:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update clothing item quantity for stock exit
app.patch('/produtos/roupas/:id/saida', async (req, res) => {
    const {quantidade} = req.body;
    if (!quantidade) {
        return res.status(400).json({ success: false, error: 'Quantidade é obrigatória!' });
    }
    try {
        await connection.execute(
            "UPDATE produto_roupa SET quantidade = quantidade - ? WHERE id = ? AND ativo = 1",
            [quantidade, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Quantidade de produto de roupa atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar quantidade de produto de roupa:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// "Delete" (disable) a clothing item by ID
app.delete('/produtos/roupas/:id', async (req, res) => {
    try {
        await connection.execute(
            "UPDATE produto_roupa SET ativo = 0 WHERE id = ? AND ativo = 1",
            [req.params.id]
        );
        res.status(200).json({ success: true, message: 'Produto de roupa removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover produto de roupa:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

//Create a new perfume item
app.post('/produtos/perfumes', async (req, res) => {
    try {
        const {nome, tamanho, genero, preco, quantidade} = req.body;

        if (!nome || !tamanho || !genero || !preco || !quantidade) {
            return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios!' });
        }
        await connection.execute(
            "INSERT INTO produto_perfume (nome, tamanho, genero, preco, quantidade) VALUES (?, ?, ?, ?, ?)",
            [nome, tamanho, genero, preco, quantidade]
        );
        res.status(201).json({success: true, message: 'Produto de perfume criado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar produto de perfume:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Get all perfume items
app.get('/produtos/perfumes', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT id, nome, tamanho, genero, preco, quantidade FROM produto_perfume WHERE ativo = 1"
        );
        res.status(200).json({success: true, data: rows});
    } catch (error) {
        console.error('Erro ao buscar produtos de perfume:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Get a perfume item by ID
app.get('/produtos/perfumes/:id', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT id, nome, tamanho, genero, preco, quantidade FROM produto_perfume WHERE id = ? AND ativo = 1",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Produto não encontrado' })
        }
        res.status(200).json({success: true, data: rows[0]});
    } catch (error) {
        console.error('Erro ao buscar produto de perfume:', error);
        res.status(500).json({success: false, error: 'Erro interno do servidor' });
    }
});

// Update a perfume item by ID
app.put('/produtos/perfumes/:id', async (req, res) => {
    try {
        const {nome, tamanho, genero, preco, quantidade} = req.body;

        if (!nome || !tamanho || !genero || !preco || !quantidade) {
            return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios!' });
        }
        await connection.execute(
            "UPDATE produto_perfume SET nome = ?, tamanho = ?, genero = ?, preco = ?, quantidade = ? WHERE id = ? AND ativo = 1",
            [nome, tamanho, genero, preco, quantidade, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Produto de perfume atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar produto de perfume:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update perfume item quantity for stock entry
app.patch('/produtos/perfumes/:id/entrada', async (req, res) => {
    const {quantidade} = req.body;
    if (!quantidade) {
        return res.status(400).json({ success: false, error: 'Quantidade é obrigatória!' });
    }
    try {
        await connection.execute(
            "UPDATE produto_perfume SET quantidade = quantidade + ? WHERE id = ? AND ativo = 1",
            [quantidade, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Quantidade de produto de perfume atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar quantidade de produto de perfume:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update perfume item quantity for stock exit
app.patch('/produtos/perfumes/:id/saida', async (req, res) => {
    const {quantidade} = req.body;
    if (!quantidade) {
        return res.status(400).json({ success: false, error: 'Quantidade é obrigatória!' });
    }
    try {
        await connection.execute(
            "UPDATE produto_perfume SET quantidade = quantidade - ? WHERE id = ? AND ativo = 1",
            [quantidade, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Quantidade de produto de perfume atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar quantidade de produto de perfume:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// "Delete" (disable) a perfume item by ID
app.delete('/produtos/perfumes/:id', async (req, res) => {
    try {
        await connection.execute(
            "UPDATE produto_perfume SET ativo = 0 WHERE id = ? AND ativo = 1",
            [req.params.id]
        );
        res.status(200).json({ success: true, message: 'Produto de perfume removido com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover produto de perfume:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// LEASE ROUTES
//Create a new lease
app.post('/condicionais', async (req, res) => {
    try {
        const {nome_cliente, telefone} = req.body;
        if (!nome_cliente) {
            return res.status(400).json({ success: false, error: 'Nome do cliente é obrigatório!' });
        }
        await connection.execute(
            "INSERT INTO condicional (nome_cliente, telefone, data_condicional) VALUES ( ?, ?, NOW())",
            [nome_cliente, telefone]
        );
        res.status(201).json({ success: true, message: 'Condicional criada com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar condicional:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Get all leases
app.get('/condicionais', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT c.id, c.nome_cliente, c.telefone, c.data_condicional, c.status_condicional FROM condicional c WHERE c.status_condicional = 'aberto'"
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Erro ao buscar condicionais:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Get a lease by ID
app.get('/condicionais/:id', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT c.id, c.nome_cliente, c.telefone, c.data_condicional, c.status_condicional FROM condicional c WHERE c.id = ?",
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Condicional não encontrada' });
        }
        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Erro ao obter condicional:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update a lease information by ID
app.put('/condicionais/:id', async (req, res) => {
    try {
        const {nome_cliente, telefone} = req.body;
        if (!nome_cliente) {
            return res.status(400).json({ success: false, error: 'Nome do cliente é obrigatório!' });
        }
        await connection.execute(
            "UPDATE condicional SET nome_cliente = ?, telefone = ? WHERE id = ?",
            [nome_cliente, telefone, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Condicional atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar condicional:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update a lease status by ID
app.patch('/condicionais/:id/status', async (req, res) => {
    try {
        const {status_condicional} = req.body;
        if (!status_condicional) {
            return res.status(400).json({ success: false, error: 'Status da condicional é obrigatório!' });
        }
        await connection.execute(
            "UPDATE condicional SET status_condicional = ? WHERE id = ?",
            [status_condicional, req.params.id]
        );
        res.status(200).json({ success: true, message: 'Status da condicional atualizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar status da condicional:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Add lease itens
app.post('/condicionais/:id/itens', async (req, res) => {
    try {
        const {tipo_produto, id_produto, quantidade_saiu} = req.body;
        if (!tipo_produto || !id_produto || !quantidade_saiu) {
            return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios!' });
        }
        await connection.execute(
            "INSERT INTO condicional_item (id_condicional, tipo_produto, id_produto, quantidade_saiu) VALUES (?, ?, ?, ?)",
            [req.params.id, tipo_produto, id_produto, quantidade_saiu]
        );
        res.status(201).json({ success: true, message: 'Item adicionado à condicional com sucesso!' });
    } catch (error) {
        console.error('Erro ao adicionar item à condicional:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });

    }
});

// Get lease itens
app.get('/condicionais/:id/itens', async (req, res) => {
    try {
        const [rows] = await connection.execute(
            "SELECT ci.id, ci.tipo_produto, ci.id_produto, ci.quantidade_saiu, ci.quantidade_devolveu FROM condicional_item ci WHERE ci.id_condicional = ?", 
            [req.params.id]
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error('Erro ao obter itens da condicional:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

// Update lease itens returned quantity
app.patch('/condicionais/:id/itens/:itemId', async (req, res) => {
    try {
        const {quantidade_devolveu} = req.body;
        if (quantidade_devolveu === undefined) {
            return res.status(400).json({ success: false, error: 'Quantidade devolvida é obrigatória!' });
        }
        await connection.execute(
            "UPDATE condicional_item SET quantidade_devolveu = ? WHERE id = ?",
            [quantidade_devolveu, req.params.itemId]
        );
        res.status(200).json({ success: true, message: 'Quantidade devolvida atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar quantidade devolvida:', error);
        res.status(500).json({ success: false, error: 'Erro interno do servidor' });
    }
});

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`)) // Start the server and listen on the specified port