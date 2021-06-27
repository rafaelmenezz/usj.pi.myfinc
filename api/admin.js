module.exports = app => {
    
    const get = async (req, res) => {
        const hoje = new Date()

        app.db
        .raw(
        'SELECT ' +
        '(SELECT sum(valor) FROM receitas WHERE YEAR(Data) = '+ hoje.getFullYear() +' AND MONTH(Data) = '+ (hoje.getMonth()+1).toString() +' AND usuarioId = '+ req.params.id +') as receitaMes, ' +
        '(SELECT sum(valor) FROM receitas WHERE YEAR(Data) = '+ hoje.getFullYear() +' AND MONTH(Data) = '+ (hoje.getMonth()) +' AND usuarioId = '+ req.params.id +') as receitaMesAnterior, ' +
        '(SELECT sum(valor) FROM receitas WHERE YEAR(Data) = '+ hoje.getFullYear() +' AND usuarioId = '+ req.params.id +')  as receitaAno, ' +
        '(SELECT sum(valor) FROM receitas WHERE Data BETWEEN CURDATE() - INTERVAL 180 DAY AND CURDATE() AND usuarioId = '+ req.params.id +')  as receitaSeisMeses, ' +
        '(SELECT sum(valor) FROM despesas WHERE YEAR(Data) = '+ hoje.getFullYear() +' AND MONTH(Data) = '+ (hoje.getMonth()+1).toString() +' AND usuarioId = '+ req.params.id +') as despesaMes, '+
        '(SELECT sum(valor) FROM despesas WHERE YEAR(Data) = '+ hoje.getFullYear() +' AND MONTH(Data) = '+ hoje.getMonth() +' AND usuarioId = '+ req.params.id +') as depesaMesAnterior, ' +
        '(SELECT sum(valor) FROM despesas WHERE YEAR(Data) = '+ hoje.getFullYear() +' AND usuarioId = '+ req.params.id +')  as despesaAno, ' +
        '(SELECT sum(valor) FROM despesas WHERE Data BETWEEN CURDATE() - INTERVAL 180 DAY AND CURDATE() AND usuarioId = '+ req.params.id +')  as despesaSeisMeses' )
        .then(admin => res.json(admin[0][0]))
        .catch(err => res.status(500).send(err))
       
    }
    
    return {get}
}