import React, { useEffect, useMemo, useState } from 'react'
import {
  Wallet, LayoutDashboard, ArrowLeftRight, Target, Repeat2, Settings,
  Bell, Search, Plus, ArrowUpRight, ArrowDownRight, TrendingUp, ShieldCheck,
  Sparkles, Coffee, ShoppingBag, Car, House, HeartPulse, GraduationCap,
  MoreHorizontal, X, Check, ChevronDown, CalendarDays, CircleHelp,
  SlidersHorizontal, PiggyBank, AlertTriangle, Zap, Menu, Trash2
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

const STARTING_BUDGET = 15000
const START_DATE = new Date('2026-10-01T12:00:00')
const initialExpenses = [
  { id: 1, title: 'Monthly groceries', category: 'Food', amount: 1250, date: 'Oct 10', icon: 'food' },
  { id: 2, title: 'Metro recharge', category: 'Transport', amount: 500, date: 'Oct 09', icon: 'transport' },
  { id: 3, title: 'Coffee with friends', category: 'Lifestyle', amount: 280, date: 'Oct 09', icon: 'lifestyle' },
  { id: 4, title: 'Mobile recharge', category: 'Bills', amount: 299, date: 'Oct 07', icon: 'bills' },
  { id: 5, title: 'Lunch', category: 'Food', amount: 180, date: 'Oct 06', icon: 'food' },
]
const categoryColors = { Food: '#7c6cf2', Transport: '#42b7a8', Lifestyle: '#f2a65a', Bills: '#5a8dee', Health: '#ec729c', Other: '#9aa3b2' }
const categoryIcons = { Food: Coffee, Transport: Car, Lifestyle: ShoppingBag, Bills: Zap, Health: HeartPulse, Other: Wallet }
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
const readSaved = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}

function App() {
  const [active, setActive] = useState('Overview')
  const [expenses, setExpenses] = useState(() => readSaved('bbf-expenses', initialExpenses))
  const [budget, setBudget] = useState(() => readSaved('bbf-budget', STARTING_BUDGET))
  const [savingsGoal, setSavingsGoal] = useState(() => readSaved('bbf-goal', 2000))
  const [modal, setModal] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [simAmount, setSimAmount] = useState(800)
  const [simCategory, setSimCategory] = useState('Lifestyle')
  const [newExpense, setNewExpense] = useState({ title: '', category: 'Food', amount: '' })
  const [newBudget, setNewBudget] = useState(String(budget))
  const [newGoal, setNewGoal] = useState(String(savingsGoal))

  useEffect(() => { localStorage.setItem('bbf-expenses', JSON.stringify(expenses)) }, [expenses])
  useEffect(() => { localStorage.setItem('bbf-budget', JSON.stringify(budget)) }, [budget])
  useEffect(() => { localStorage.setItem('bbf-goal', JSON.stringify(savingsGoal)) }, [savingsGoal])

  const spent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const remaining = budget - spent
  const daysLeft = 21
  const dailyAllowance = Math.max(0, remaining / daysLeft)
  const projected = spent + dailyAllowance * 30
  const safeToSpend = remaining - savingsGoal
  const health = remaining / Math.max(1, budget)
  const filteredExpenses = expenses.filter(e => `${e.title} ${e.category}`.toLowerCase().includes(search.toLowerCase()))
  const categories = useMemo(() => {
    const totals = {}
    expenses.forEach(e => { totals[e.category] = (totals[e.category] || 0) + Number(e.amount) })
    return Object.entries(totals).map(([name, value]) => ({ name, value, color: categoryColors[name] || categoryColors.Other }))
  }, [expenses])
  const trend = [
    { day: '1 Oct', spent: 0 }, { day: '4 Oct', spent: Math.round(spent * .15) },
    { day: '7 Oct', spent: Math.round(spent * .33) }, { day: '10 Oct', spent: spent },
    { day: '14 Oct', spent: Math.round(spent + (budget - spent) * .26) },
    { day: '18 Oct', spent: Math.round(spent + (budget - spent) * .48) },
    { day: '22 Oct', spent: Math.round(spent + (budget - spent) * .7) },
    { day: '30 Oct', spent: Math.round(projected) },
  ]

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  function addExpense(e) {
    e.preventDefault()
    const amount = Number(newExpense.amount)
    if (!newExpense.title.trim() || !amount || amount < 1) return notify('Add a name and a valid amount.')
    const Icon = categoryIcons[newExpense.category]
    setExpenses([{ id: Date.now(), title: newExpense.title.trim(), category: newExpense.category, amount, date: 'Today', icon: newExpense.category.toLowerCase() }, ...expenses])
    setNewExpense({ title: '', category: 'Food', amount: '' })
    setModal('')
    notify('Expense added to your month.')
  }
  function resetDemo() {
    setExpenses(initialExpenses); setBudget(STARTING_BUDGET); setSavingsGoal(2000)
    setModal(''); notify('Demo data reset.')
  }
  const navItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Transactions', icon: ArrowLeftRight },
  ]

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand"><span>pocket</span></div>
      <div className="workspace-label">YOUR MONEY SPACE</div>
      <nav>{navItems.map(({label, icon: Icon}) => <button key={label} className={`nav-item ${active === label ? 'active' : ''}`} onClick={() => { setActive(label); setMobileNav(false) }}><Icon size={18}/><span>{label}</span>{label === 'Transactions' && <span className="nav-count">{expenses.length}</span>}</button>)}</nav>
      
    </aside>

    <main className="main-content">
      <header className="topbar">
        <button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)}><Menu size={20}/></button>
        
        <div className="top-actions"><div className="month-select"><CalendarDays size={15}/> October 2026 <ChevronDown size={14}/></div><div className="avatar avatar-small">Money</div></div>
      </header>

      <div className="page-wrap">
        {active === 'Overview' && <>
          <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> MONTHLY BUDGET MANAGE</div><h1>Hey Client,</h1> </div><button className="primary-btn" onClick={() => setModal('add')}><Plus size={17}/> Add expense</button></section>
          <section className="hero-card">
            <div className="hero-copy"><div className="hero-label">
               MONTHLY BUDGET</div><div className="hero-amount">{money(remaining)}<span> left</span></div><div className="progress-track"><div className="progress-fill" style={{width:`${Math.min(100, spent / Math.max(1,budget) * 100)}%`}}/></div><div className="progress-foot"><span>{money(spent)} spent</span><span>{money(budget)} total</span></div></div>
        
          </section>

          <section className="metric-grid">
            <Metric icon={Wallet} label="Daily allowance" value={money(dailyAllowance)}  tone="purple" />
            <Metric icon={PiggyBank} label="Savings goal" value={money(savingsGoal)}  tone="green"/>
            <Metric icon={TrendingUp} label="Month-end forecast" value={money(projected)} note={projected > budget ? `${money(projected-budget)} over budget if pace continues` : 'You’re on track this month'} tone="orange" />
          </section>

          <section className="content-grid lower-grid">
            <div className="panel transactions-panel"><div className="panel-heading"><div><h2>Recent transactions</h2></div></div><TransactionList expenses={expenses.slice(0,4)} onDelete={id => {setExpenses(expenses.filter(e=>e.id!==id));notify('Expense removed.')}}/></div>

          </section>
        </>}

        {active === 'Transactions' && <section className="page-section"><div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR MONEY TRAIL</div><h1>Transactions History</h1></div><button className="primary-btn" onClick={() => setModal('add')}> Add expense</button></div><div className="panel all-transactions"><div className="panel-heading"><div><h2>All transactions</h2></div><div className="search-box"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions"/></div></div><TransactionList expenses={filteredExpenses} onDelete={id => {setExpenses(expenses.filter(e=>e.id!==id));notify('Expense removed.')}} emptyText="No matching transactions."/></div></section>}


      </div>
    </main>

    {mobileNav && <button className="mobile-overlay" aria-label="Close menu" onClick={() => setMobileNav(false)}/>}
    {modal && <div className="modal-backdrop" onMouseDown={e => {if(e.target===e.currentTarget)setModal('')}}><div className="modal-card" role="dialog" aria-modal="true">
      <button className="modal-close icon-button" onClick={() => setModal('')} aria-label="Close"><X size={19}/></button>
      {modal === 'add' && <><h2>Add an expense</h2><form onSubmit={addExpense} className="form-stack"><div className="form-row"><label>Amount (₹)<input type="number" min="1" max="1000000" value={newExpense.amount} onChange={e=>setNewExpense({...newExpense,amount:e.target.value})} placeholder="250" required/></label><label>Category<select value={newExpense.category} onChange={e=>setNewExpense({...newExpense,category:e.target.value})}>{Object.keys(categoryColors).map(c=><option key={c}>{c}</option>)}</select></label></div><button className="primary-btn full-width" type="submit">Save expense <Check size={16}/></button></form></>}

    </div></div>}
    {toast && <div className="toast"><span className="toast-check"><Check size={14}/></span>{toast}</div>}
  </div>
}

function Metric({icon: Icon,label,value,note,tone,badge}) {
  return <div className="metric-card"><div className="metric-top"><div className={`metric-icon ${tone}`}><Icon size={18}/></div><span className="metric-badge">{badge}</span></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></div>
}
function TransactionList({expenses,onDelete,emptyText='No expenses yet — add your first one.'}) {
  if (!expenses.length) return <EmptyState title="Nothing to see yet" text={emptyText}/>
  return <div className="transaction-list">{expenses.map(e=>{const Icon=categoryIcons[e.category]||Wallet;return <div className="transaction-row" key={e.id}><div className={`transaction-icon ${e.category.toLowerCase()}`}><Icon size={17}/></div><div className="transaction-copy"><strong>{e.title}</strong><span>{e.category} · {e.date}</span></div><div className="transaction-amount">−{money(e.amount)}</div><button className="delete-transaction" aria-label={`Delete ${e.title}`} onClick={()=>onDelete(e.id)}><Trash2 size={14}/></button></div>})}</div>
}
function EmptyState({title,text}) { return <div className="empty-state"><div><Wallet size={21}/></div><strong>{title}</strong><p>{text}</p></div> }

export default App
