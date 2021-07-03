module.exports = app => {
    
    const get = async (req, res) => {
        const hoje = new Date()

        app.db
        .raw(
        "SELECT " +
        "(SELECT sum(valor) FROM receitas WHERE EXTRACT(year FROM data ) = "+ hoje.getFullYear() +" AND EXTRACT(month FROM data ) = "+ (hoje.getMonth()+1).toString() +" AND usuario_id = "+ req.params.id +") as receitaMes, " +
        "(SELECT sum(valor) FROM receitas WHERE EXTRACT(year FROM data ) = "+ hoje.getFullYear() +" AND EXTRACT(month FROM data ) = "+ (hoje.getMonth()) +" AND usuario_id = "+ req.params.id +") as receitaMesAnterior, "+
        "(SELECT sum(valor) FROM receitas WHERE EXTRACT(year FROM data ) = "+ hoje.getFullYear() +" AND usuario_id = "+ req.params.id +")  as receitaAno, " +
        "(SELECT sum(valor) FROM receitas WHERE  data >  CURRENT_DATE - INTERVAL '6 month' AND usuario_id = "+ req.params.id +")  as receitaSeisMeses, " +
        "(SELECT sum(valor) FROM despesas WHERE EXTRACT(year FROM data ) = "+ hoje.getFullYear() +" AND EXTRACT(month FROM data )  = "+ (hoje.getMonth()+1).toString() +" AND usuario_id = "+ req.params.id +") as despesaMes, "+
        "(SELECT sum(valor) FROM despesas WHERE EXTRACT(year FROM data ) = "+ hoje.getFullYear() +" AND EXTRACT(month FROM data ) = "+ hoje.getMonth() +" AND usuario_id = "+ req.params.id +") as depesaMesAnterior, " +
        "(SELECT sum(valor) FROM despesas WHERE EXTRACT(year FROM data ) = "+ hoje.getFullYear() +" AND usuario_id = "+ req.params.id +")  as despesaAno, " +
        "(SELECT sum(valor) FROM despesas WHERE data >  CURRENT_DATE - INTERVAL '6 month' AND usuario_id = "+ req.params.id +")  as despesaSeisMeses" )
        .then(admin => res.json(admin[0][0]))
        .catch(err => res.status(500).send(err))
       
    }
    
    return {get}
}