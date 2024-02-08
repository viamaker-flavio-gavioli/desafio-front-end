import React, { useEffect, useState } from 'react';
import { Card, Space, Layout, Input, Button, message } from 'antd';

const { Header, Content } = Layout;

const App = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '', imagem: '' });

  const fetchProdutos = async () => {
    try {
      const response = await fetch('http://localhost:3210/produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao obter produtos:', error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoProduto({ ...novoProduto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Botão clicado - handleSubmit chamado');
    try {
      // Verifica se o campo de preço não está vazio
      if (!novoProduto.preco.trim()) {
        throw new Error('Por favor, preencha o campo de preço.');
      }
      // Converte o preço para um número antes de enviar para o backend
      const precoNumerico = parseFloat(novoProduto.preco);
      await fetch('http://localhost:3210/produtos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...novoProduto, preco: precoNumerico }),
      });
      message.success('Produto adicionado com sucesso!');
      setNovoProduto({ nome: '', preco: '', imagem: '' });
      fetchProdutos(); // Atualiza a lista de produtos após adicionar o novo produto
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      message.error(error.message || 'Erro ao adicionar produto. Por favor, tente novamente.');
    }
  };

  return (
    <Layout>
      <Header style={{ background: '#333', height: '50px' }} />
      <Content style={{ padding: '0 50px' }}>
        <div style={{ marginTop: '20px' }}>
          <h1>Usando o React</h1>
          <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div>
              <label htmlFor="nome">Nome do Produto: </label>
              <Input
                required
                id="nome"
                style={{ width: '500px' }}
                placeholder="Digite o nome do produto"
                name="nome"
                value={novoProduto.nome}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="preco">Preço do Produto: </label>
              <Input
                required
                id="preco"
                style={{ width: '500px' }}
                placeholder="Digite o preço do produto"
                name="preco"
                type="number"
                value={novoProduto.preco}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="imagem">Link para a Imagem do Produto: </label>
              <Input
                required
                id="imagem"
                style={{ width: '500px' }}
                placeholder="Digite o link para a imagem do produto"
                name="imagem"
                value={novoProduto.imagem}
                onChange={handleInputChange}
              />
            </div>
            <Button type="primary" htmlType="submit" style={{ width: '250px' }}>Salvar Produto</Button>
          </form>

          <Space direction="horizontal" size="middle" style={{ display: 'flex', flexWrap: 'wrap' }}>
            {produtos.map((produto, index) => (
              <Card key={index} size="small" style={{ margin: '10px', flex: '1', minWidth: '200px' }}>
                <img src={produto.imagem} style={{ border: '1px solid #ccc', width: '100%', height: '200px' }} alt={produto.nome} />
                <p style={{ textAlign: 'center' }}>{produto.nome}</p>
              </Card>
            ))}
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
