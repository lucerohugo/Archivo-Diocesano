'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, Trash2, Pencil, PlusCircle, ChevronUp, ChevronDown } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { getAllRegistros } from '@/lib/mock-data';
import { Registro } from '@/lib/types';

const initialRegistros = getAllRegistros();

type SortKey = 'id' | 'fecha_recepcion' | 'anio';
type SortDir = 'asc' | 'desc';

export default function AdminRegistrosPage() {
  const [registros, setRegistros] = useState<Registro[]>(initialRegistros);
  const [query, setQuery] = useState('');
  const [anioFilter, setAnioFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const allYears = Array.from(new Set(initialRegistros.map((r) => r.anio))).sort((a, b) => b - a);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let list = registros.filter((r) => {
      const q = query.toLowerCase();
      const matchQuery = !q || r.titulo_referencia.toLowerCase().includes(q) || r.codigo.includes(q) || String(r.anio).includes(q);
      const matchAnio = !anioFilter || String(r.anio) === anioFilter;
      const matchFrom = !dateFrom || r.fecha_recepcion >= dateFrom;
      const matchTo = !dateTo || r.fecha_recepcion <= dateTo;
      return matchQuery && matchAnio && matchFrom && matchTo;
    });
    list = [...list].sort((a, b) => {
      const av = sortKey === 'id' ? a.id : sortKey === 'anio' ? a.anio : a.fecha_recepcion;
      const bv = sortKey === 'id' ? b.id : sortKey === 'anio' ? b.anio : b.fecha_recepcion;
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [registros, query, anioFilter, dateFrom, dateTo, sortKey, sortDir]);

  const handleDelete = (id: number) => {
    setRegistros((r) => r.filter((reg) => reg.id !== id));
    setDeleteConfirm(null);
  };

  const clearFilters = () => { setQuery(''); setAnioFilter(''); setDateFrom(''); setDateTo(''); };
  const hasFilters = query || anioFilter || dateFrom || dateTo;

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={10} className="opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
  }

  return (
    <div className="page-container">
      <AppHeader
        showAdminNav
        breadcrumb={[
          { label: 'Panel', href: '/registrar' },
          { label: 'Todos los registros' },
        ]}
      />

      <div className="content-wrapper pb-16 pt-10">
        {/* Header */}
        <div className="page-header">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">
                Administración
              </p>
              <h1 className="page-title">Todos los registros históricos</h1>
              <p className="page-subtitle">{registros.length} registros en total — públicos y privados</p>
            </div>
            <Link href="/registrar/crear" className="btn-primary">
              <PlusCircle size={14} />
              Nuevo registro
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-card">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">
            Buscar y filtrar
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[200px] flex-[2]">
              <label className="filter-label">Buscar</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por código, título o año..."
                />
              </div>
            </div>
            <div className="min-w-[140px]">
              <label className="filter-label">
                <Calendar size={10} className="mr-1 inline" />
                Filtrar por año
              </label>
              <select className="form-select" value={anioFilter} onChange={(e) => setAnioFilter(e.target.value)}>
                <option value="">Todos los años</option>
                {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="min-w-[140px]">
              <label className="filter-label">Fecha desde</label>
              <input className="form-input" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="min-w-[140px]">
              <label className="filter-label">Fecha hasta</label>
              <input className="form-input" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary">Limpiar</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="card-section">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button
                      onClick={() => toggleSort('id')}
                      className="flex items-center gap-1 bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.1em] text-white cursor-pointer"
                    >
                      Código <SortIcon col="id" />
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => toggleSort('fecha_recepcion')}
                      className="flex items-center gap-1 bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.1em] text-white cursor-pointer"
                    >
                      Fecha <SortIcon col="fecha_recepcion" />
                    </button>
                  </th>
                  <th>Título referencia</th>
                  <th>
                    <button
                      onClick={() => toggleSort('anio')}
                      className="flex items-center gap-1 bg-transparent border-none text-[10px] font-bold uppercase tracking-[0.1em] text-white cursor-pointer"
                    >
                      Año <SortIcon col="anio" />
                    </button>
                  </th>
                  <th>Visibilidad</th>
                  <th>Archivos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-sm text-slate-400">
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <span className="text-[13px] font-bold text-sky-700">{r.codigo}</span>
                      </td>
                      <td className="whitespace-nowrap text-xs text-slate-500">
                        {r.fecha_recepcion}
                      </td>
                      <td className="max-w-[380px]">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-slate-800">
                          {r.titulo_referencia}
                        </span>
                      </td>
                      <td className="font-semibold text-slate-800">{r.anio}</td>
                      <td>
                        <span className={r.visibilidad === 'publico' ? 'badge-public' : 'badge-private'}>
                          {r.visibilidad === 'publico' ? 'Público' : 'Privado'}
                        </span>
                      </td>
                      <td>
                        {r.archivos.length > 0
                          ? r.archivos.map((a) => <span key={a.id} className="badge-file">{a.tipo}</span>)
                          : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Link href={`/registrar/editar/${r.id}`} className="btn-edit no-underline">
                            <Pencil size={11} />
                            Editar
                          </Link>
                          {deleteConfirm === r.id ? (
                            <div className="flex items-center gap-1">
                              <button className="btn-danger text-[10px] px-2 py-1" onClick={() => handleDelete(r.id)}>
                                Confirmar
                              </button>
                              <button className="btn-secondary text-[10px] px-2 py-1" onClick={() => setDeleteConfirm(null)}>
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button className="btn-danger" onClick={() => setDeleteConfirm(r.id)}>
                              <Trash2 size={11} />
                              Borrar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <span className="text-[11px] text-slate-400">
                {filtered.length} registro{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[11px] text-slate-400">
                {filtered.filter(r => r.visibilidad === 'publico').length} públicos · {filtered.filter(r => r.visibilidad === 'privado').length} privados
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
