
// API DE GESTÃO DE CLIENTES - LEITURA E ESCRITA NO LOCALSTORAGE
const AdminClientesAPI = {
    obterClientes(status = "") {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        clientes = clientes.filter(u => u.role === "cliente");
        // Garantir que todos têm aprovadoAdmin e rejeitado definidos
        clientes = clientes.map(c => ({
            ...c,
            aprovadoAdmin: c.aprovadoAdmin ?? false,
            rejeitado: c.rejeitado ?? false
        }));
        if (status === "aprovado") return clientes.filter(c => c.aprovadoAdmin === true);
        if (status === "pendente") return clientes.filter(c => c.aprovadoAdmin === false && !c.rejeitado);
        if (status === "rejeitado") return clientes.filter(c => c.rejeitado === true);
        return clientes;
    },
    obterCliente(id) {
        const clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        return clientes.find(c => c.id === id && c.role === "cliente");
    },
    aprovarCliente(id) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const idx = clientes.findIndex(c => c.id === id);
        if (idx >= 0) {
            clientes[idx].aprovadoAdmin = true;
            clientes[idx].rejeitado = false;
            clientes[idx].dataAprovacao = new Date().toLocaleDateString('pt-BR');
            localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
            return true;
        }
        return false;
    },
    rejeitarCliente(id) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        const idx = clientes.findIndex(c => c.id === id);
        if (idx >= 0) {
            clientes[idx].aprovadoAdmin = false;
            clientes[idx].rejeitado = true;
            clientes[idx].dataRejeicao = new Date().toLocaleDateString('pt-BR');
            localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
            return true;
        }
        return false;
    },
    deletarCliente(id) {
        let clientes = JSON.parse(localStorage.getItem("rtv_usuarios")) || [];
        clientes = clientes.filter(c => c.id !== id);
        localStorage.setItem("rtv_usuarios", JSON.stringify(clientes));
        return true;
    },
    obterEstatisticas() {
        const clientes = this.obterClientes();
        return {
            totalClientes: clientes.length,
            aprovados: clientes.filter(c => c.aprovadoAdmin === true).length,
            pendentes: clientes.filter(c => c.aprovadoAdmin === false && !c.rejeitado).length,
            rejeitados: clientes.filter(c => c.rejeitado === true).length
        };
    }
};
window.AdminClientesAPI = AdminClientesAPI;
