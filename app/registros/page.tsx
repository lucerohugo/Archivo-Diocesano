'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, BookOpen, ChevronRight } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { getPublicRegistros } from '@/lib/mock-data';

const registros = getPublicRegistros();
const allYears = Array.from(new Set(registros.map((r) => r.anio))).sort((a, b) => b - a);
const allCategorias = Array.from(new Set(registros.map((r) => r.categoria))).filter(Boolean);

export default function RegistrosPage() {
  const [query, setQuery] = useState('');
  const [anioFilter, setAnioFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const filtered = useMemo(() => {
    return registros.filter((r) => {
      const q = query.toLowerCase();
      const matchQ = !q || r.titulo_referencia.toLowerCase().includes(q) || r.codigo.includes(q) || r.origen.toLowerCase().includes(q) || r.descripcion_breve.toLowerCase().includes(q) || String(r.anio).includes(q);
      const matchA = !anioFilter || String(r.anio) === anioFilter;
      const matchC = !catFilter || r.categoria === catFilter;
      return matchQ && matchA && matchC;
    });
  }, [query, anioFilter, catFilter]);

  const hasFilters = query || anioFilter || catFilter;

  return (
    <div className="page-container">
      <AppHeader />
      <div className="content-wrapper pb-16 pt-10">
        {/* Page header */}
        <div className="page-header">
          <Link href="/" className="btn-back mb-4 inline-flex ">
            Inicio
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-700">
                documentacion conservada
              </p>
              <h1 className="page-title">Registros Históricos</h1>
              <p className="page-subtitle">
                {registros.length} documentos disponibles
              </p>
            </div>
            {/* <Link href="/" className="btn-back">Inicio</Link> */}
          </div>
        </div>

        {/* Filters */}
        <div className="filter-card">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <label className="filter-label">Buscar</label>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por título, código, origen..."
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <label className="filter-label">Año</label>
              <select className="form-select" value={anioFilter} onChange={(e) => setAnioFilter(e.target.value)}>
                <option value="">Todos los años</option>
                {allYears.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="min-w-[180px]">
              <label className="filter-label">Categoría</label>
              <select className="form-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
                <option value="">Todas las categorías</option>
                {allCategorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {hasFilters && (
              <button
                onClick={() => { setQuery(''); setAnioFilter(''); setCatFilter(''); }}
                className="btn-secondary"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={36} className="mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-400">Sin resultados</p>
            <p className="mt-1 text-sm text-slate-400">
              No se encontraron registros con los filtros aplicados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <Link key={r.id} href={`/registros/${r.id}`} className="no-underline">
                <div className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
                  {/* Code badge */}
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-sky-100 bg-sky-50">
                    <span className="text-[8px] font-bold uppercase text-sky-500">N°</span>
                    <span className="text-lg font-bold leading-none text-sky-800">{r.codigo}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="rounded border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-700">
                        {r.categoria}
                      </span>
                      <span className="text-xs text-slate-400">
                        {r.anio} · {r.origen}
                      </span>
                    </div>

                    <h2 className="mb-1.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                      {r.titulo_referencia}
                    </h2>

                    {r.descripcion_breve && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {r.descripcion_breve}
                      </p>
                    )}

                    {r.archivos.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {r.archivos.map((a) => (
                          <span key={a.id} className="badge-file">{a.tipo}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <ChevronRight size={15} className="mt-1 shrink-0 text-slate-300 transition-colors group-hover:text-sky-400" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="mt-6 text-center text-[11px] text-slate-400">
            Mostrando {filtered.length} de {registros.length} registros
          </p>
        )}
      </div>
    </div>
  );
}
