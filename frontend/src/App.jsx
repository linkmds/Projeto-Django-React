import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

function App() {
  const [tarefas, setTarefas] = useState([])
  const [novoTitulo, setNovoTitulo] = useState('')
  const [novaDescricao, setNovaDescricao] = useState('') // Estado da descrição
  const [token, setToken] = useState(localStorage.getItem('access_token'))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  
  // ESTADOS DE XP E PERFIL
  const [xp, setXp] = useState(parseInt(localStorage.getItem('user_xp')) || 0)
  const [nivel, setNivel] = useState(Math.floor(xp / 100) + 1)
  const [nomeExibicao, setNomeExibicao] = useState(localStorage.getItem('user_display_name') || 'Jogador')
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

  // CONTROLES DE INTERFACE
  const [idExcluindo, setIdExcluindo] = useState(null)
  const [editandoId, setEditandoId] = useState(null)
  const [tituloEditando, setTituloEditando] = useState('')
  const [descricaoEditando, setDescricaoEditando] = useState('')

  // GARANTE QUE O TOKEN SEJA ENVIADO (Resolve o erro 401 Unauthorized)
  const api = useMemo(() => {
    return axios.create({
      baseURL: 'http://127.0.0.1:8000/api/',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  }, [token])

  useEffect(() => {
    const novoNivel = Math.floor(xp / 100) + 1
    setNivel(novoNivel)
    localStorage.setItem('user_xp', xp)
  }, [xp])

  const buscarTarefas = () => {
    api.get('tarefas/')
      .then(res => setTarefas(res.data))
      .catch(err => console.error("Erro ao buscar:", err))
  }

  useEffect(() => { if (token) buscarTarefas() }, [token, api])

  // --- BOTÃO SALVAR CORRIGIDO (COM DESCRIÇÃO) ---
  const adicionarTarefa = (e) => {
    e.preventDefault()
    if (!novoTitulo.trim()) return

    // Enviando título e descrição para o Django
    api.post('tarefas/', { 
      titulo: novoTitulo, 
      descricao: novaDescricao, 
      completada: false 
    })
      .then(() => { 
        buscarTarefas()
        setNovoTitulo('')
        setNovaDescricao('')
      })
      .catch(err => {
        console.error("Erro no botão salvar:", err)
        alert("Erro ao salvar. Verifique se você está logado.")
      })
  }

  const alternarStatus = (id, statusAtual) => {
    api.patch(`tarefas/${id}/`, { completada: !statusAtual }).then(() => {
      if (!statusAtual) setXp(prev => prev + 20) 
      else setXp(prev => Math.max(0, prev - 20))
      buscarTarefas()
    })
  }

  const salvarEdicao = (id) => {
    api.patch(`tarefas/${id}/`, { titulo: tituloEditando, descricao: descricaoEditando })
      .then(() => { setEditandoId(null); buscarTarefas(); })
  }

  const deletarTarefaComAnimacao = (id) => {
    setIdExcluindo(id)
    setTimeout(() => {
      api.delete(`tarefas/${id}/`).then(() => {
        buscarTarefas()
        setIdExcluindo(null)
      }).catch(() => setIdExcluindo(null))
    }, 500)
  }

  const fazerLogin = (e) => {
    e.preventDefault()
    axios.post('http://127.0.0.1:8000/api/token/', { username, password })
      .then(res => {
        localStorage.setItem('access_token', res.data.access)
        setToken(res.data.access)
        window.location.reload()
      })
      .catch(() => alert("Usuário ou senha incorretos."))
  }

  if (!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100vw', backgroundColor: '#0f172a', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ backgroundColor: '#1e293b', padding: '40px', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
          <h2>Login MyTasks</h2>
          <form onSubmit={fazerLogin}>
            <input type="text" placeholder="Usuário" onChange={e => setUsername(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0' }} required />
            <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} style={{ display: 'block', width: '100%', padding: '10px', margin: '15px 0' }} required />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#0ea5e9', border: 'none', color: 'white', borderRadius: '8px', fontWeight: 'bold' }}>ENTRAR</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, fontFamily: 'sans-serif', color: 'white', overflowX: 'hidden' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', backgroundColor: '#1e293b', borderBottom: '2px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ color: '#38bdf8', margin: 0 }}>🎯 MyTasks</h1>
          <div style={{ backgroundColor: '#0f172a', padding: '5px 15px', borderRadius: '20px', border: '1px solid #38bdf8' }}>
            <span style={{ color: '#facc15', fontWeight: 'bold' }}>Nível {nivel}</span>
            <div style={{ width: '100px', height: '6px', backgroundColor: '#334155', borderRadius: '3px', marginTop: '4px' }}>
              <div style={{ width: `${xp % 100}%`, height: '100%', backgroundColor: '#facc15', borderRadius: '3px' }}></div>
            </div>
          </div>
        </div>
        <div onClick={() => setMostrarPerfil(true)} style={{ textAlign: 'right', cursor: 'pointer', border: '1px solid #334155', padding: '8px 15px', borderRadius: '8px', backgroundColor: '#0f172a' }}>
          <div style={{ fontWeight: 'bold', color: '#38bdf8' }}>{nomeExibicao}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{xp} XP Acumulado</div>
        </div>
      </header>

      <main style={{ padding: '40px 5%' }}>
        {/* FORMULÁRIO COM TÍTULO E DESCRIÇÃO */}
        <section style={{ backgroundColor: '#1e293b', padding: '25px', borderRadius: '15px', marginBottom: '40px' }}>
          <form onSubmit={adicionarTarefa} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '15px' }}>
              <input 
                type="text" placeholder="Nome da missão..." value={novoTitulo} 
                onChange={e => setNovoTitulo(e.target.value)} 
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} 
                required 
              />
              <button type="submit" style={{ padding: '0 40px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>SALVAR</button>
            </div>
            {/* CAMPO DE DESCRIÇÃO REATIVADO */}
            <input 
              type="text" placeholder="Detalhes da missão (opcional)..." value={novaDescricao} 
              onChange={e => setNovaDescricao(e.target.value)} 
              style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#0f172a', color: 'white' }} 
            />
          </form>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {tarefas.map(t => (
            <div key={t.id} style={{ 
              backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', 
              borderLeft: t.completada ? '6px solid #10b981' : '6px solid #38bdf8',
              opacity: idExcluindo === t.id ? 0 : 1, transition: '0.5s', transform: idExcluindo === t.id ? 'translateY(20px)' : 'none'
            }}>
              {editandoId === t.id ? (
                <>
                  <input value={tituloEditando} onChange={e => setTituloEditando(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                  <input value={descricaoEditando} onChange={e => setDescricaoEditando(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button onClick={() => salvarEdicao(t.id)} style={{ flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px', borderRadius: '4px' }}>OK</button>
                    <button onClick={() => setEditandoId(null)} style={{ flex: 1, backgroundColor: '#64748b', color: 'white', border: 'none', padding: '8px', borderRadius: '4px' }}>X</button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ margin: 0, textDecoration: t.completada ? 'line-through' : 'none' }}>{t.titulo}</h3>
                  {/* EXIBIÇÃO DA DESCRIÇÃO NA TAREFA */}
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '10px 0' }}>{t.descricao || 'Sem detalhes'}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button onClick={() => alternarStatus(t.id, t.completada)} style={{ flex: 1, padding: '8px', backgroundColor: t.completada ? '#64748b' : '#38bdf8', color: 'white', border: 'none', borderRadius: '6px' }}>{t.completada ? 'Refazer' : 'Concluir'}</button>
                    <button onClick={() => { setEditandoId(t.id); setTituloEditando(t.titulo); setDescricaoEditando(t.descricao || ''); }} style={{ padding: '8px', backgroundColor: 'transparent', color: '#facc15', border: '1px solid #facc15', borderRadius: '6px' }}>✏️</button>
                    <button onClick={() => deletarTarefaComAnimacao(t.id)} style={{ padding: '8px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px' }}>🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* MODAL PERFIL */}
      {mostrarPerfil && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '100vh', backgroundColor: '#1e293b', boxShadow: '-5px 0 15px rgba(0,0,0,0.5)', zIndex: 100, padding: '30px' }}>
          <button onClick={() => setMostrarPerfil(false)} style={{ background: 'none', color: 'white', border: 'none', fontSize: '1.5rem', float: 'right', cursor: 'pointer' }}>&times;</button>
          <h2>Perfil do Jogador</h2>
          <input type="text" value={nomeExibicao} onChange={e => setNomeExibicao(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', borderRadius: '5px', backgroundColor: '#0f172a', color: 'white', border: 'none' }} />
          <button onClick={() => { localStorage.setItem('user_display_name', nomeExibicao); setMostrarPerfil(false); }} style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px' }}>SALVAR</button>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', marginTop: '20px' }}>SAIR</button>
        </div>
      )}
    </div>
  )
}

export default App