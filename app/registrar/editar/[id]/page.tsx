'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { getRegistroById } from '@/lib/mock-data';

type Tab = 'datos' | 'almacenamiento' | 'archivos';
const TABS: { id: Tab; label: string }[] = [
  { id: 'datos', label: 'Datos principales' },
  { id: 'almacenamiento', label: 'Almacenamiento' },
  { id: 'archivos', label: 'Archivos' },
];
const SEGMENTOS = ['Histórico', 'Sacramental', 'Administrativo', 'Episcopal', 'Pontificio'];
const ESTADOS = ['Excelente', 'Bueno', 'Regular', 'Malo', 'Deteriorado'];
const CONDICIONES = ['Libre', 'Restringido', 'Investigadores', 'Bajo solicitud'];
const COND_REPRO = ['Permitida', 'Bajo solicitud', 'Permitida con autorización', 'No permitida'];
const ORIG_COPIA = ['Original', 'Copia', 'Copia certificada', 'Microfilm'];
const SALAS = ['Archivo Histórico', 'Archivo Reservado', 'Depósito', 'Sala de consulta'];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-section">
      <div className="section-header">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function F({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`form-field${wide ? ' col-span-2' : ''}`}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

export default function EditarRegistroPage() {
  const params = useParams();
  const router = useRouter();
  const original = getRegistroById(Number(params.id));
  const [tab, setTab] = useState<Tab>('datos');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [form, setForm] = useState(
    original ? {
      fecha_recepcion: original.fecha_recepcion, titulo_referencia: original.titulo_referencia,
      descripcion_breve: original.descripcion_breve, origen: original.origen, categoria: original.categoria,
      anio: String(original.anio), numero_protocolar: original.numero_protocolar, segmento: original.segmento,
      tema: original.tema, area: original.area, asunto: original.asunto, iniciador: original.iniciador,
      destinatarios: original.destinatarios, visibilidad: original.visibilidad,
      grupo: original.grupo, serie: original.serie, sub_serie: original.sub_serie, soporte: original.soporte,
      estado_conservacion: original.estado_conservacion, cond_acceso: original.cond_acceso,
      cond_reproduccion: original.cond_reproduccion, lengua_escritura: original.lengua_escritura,
      original_copia: original.original_copia, lugar_destino: original.lugar_destino,
      ubicacion_sala: original.ubicacion_sala, pasillo: original.pasillo, estanteria: original.estanteria,
      casillero: original.casillero, caja_nro: original.caja_nro, legajo: original.legajo,
      numero: original.numero, folios: original.folios, hojas: original.hojas,
      medidas: original.medidas, nota_archivero: original.nota_archivero,
    } : null
  );

  if (!original || !form) {
    return (
      <div className="page-container">
        <AppHeader showAdminNav />
        <div className="mx-auto max-w-md py-24 text-center">
          <AlertCircle size={36} className="mx-auto mb-4 text-slate-300" />
          <h2 className="mb-2 text-xl font-semibold text-slate-700">Registro no encontrado</h2>
          <Link href="/admin/registros" className="btn-primary">Volver al listado</Link>
        </div>
      </div>
    );
  }

  const s = (k: keyof typeof form, v: string) => setForm((f) => f ? { ...f, [k]: v } : f);
  const addFiles = (fl: FileList | null) => { if (fl) setNewFiles((p) => [...p, ...Array.from(fl)]); };
  const submit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    router.push('/admin/registros');
  };

  return (
    <div className="page-container">
      <AppHeader showAdminNav breadcrumb={[{ label: 'Panel', href: '/registrar' }, { label: 'Registros', href: '/admin/registros' }, { label: `Editar N° ${original.codigo}` }]} />
      <div className="content-wrapper pb-20 pt-9">
        <div className="mb-8 text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-700">
            Registro N° {original.codigo}
          </p>
          <h1 className="text-xl font-semibold text-slate-900">Editar registro histórico</h1>
        </div>

        <div className="tab-nav">
          {TABS.map((t, i) => (
            <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <span className={`mr-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${tab === t.id ? 'bg-sky-800 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i + 1}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'datos' && (
          <div>
            <Card title="Datos principales de registro">
              <div className="form-grid-2">
                <F label="Fecha de recepción"><input className="form-input" type="date" value={form.fecha_recepcion} onChange={(e) => s('fecha_recepcion', e.target.value)} /></F>
                <F label="Título referencia *"><input className="form-input" type="text" value={form.titulo_referencia} onChange={(e) => s('titulo_referencia', e.target.value)} /></F>
                <F label="Descripción breve" wide><textarea className="form-textarea" value={form.descripcion_breve} onChange={(e) => s('descripcion_breve', e.target.value)} rows={3} /></F>
              </div>
            </Card>
            <Card title="Referencias y clasificación">
              <div className="form-grid-2">
                <F label="Origen"><input className="form-input" type="text" value={form.origen} onChange={(e) => s('origen', e.target.value)} /></F>
                <F label="Categoría"><input className="form-input" type="text" value={form.categoria} onChange={(e) => s('categoria', e.target.value)} /></F>
              </div>
            </Card>
            <Card title="Numeración y fechas">
              <div className="form-grid-3">
                <F label="Año"><input className="form-input" type="number" value={form.anio} onChange={(e) => s('anio', e.target.value)} /></F>
                <F label="Número protocolar"><input className="form-input" type="text" value={form.numero_protocolar} onChange={(e) => s('numero_protocolar', e.target.value)} /></F>
                <F label="Segmento"><select className="form-select" value={form.segmento} onChange={(e) => s('segmento', e.target.value)}><option value="">Seleccionar</option>{SEGMENTOS.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
              </div>
            </Card>
            <Card title="Asunto y alcances">
              <div className="form-grid-2">
                <F label="Tema"><input className="form-input" type="text" value={form.tema} onChange={(e) => s('tema', e.target.value)} /></F>
                <F label="Área"><input className="form-input" type="text" value={form.area} onChange={(e) => s('area', e.target.value)} /></F>
                <F label="Asunto" wide><input className="form-input" type="text" value={form.asunto} onChange={(e) => s('asunto', e.target.value)} /></F>
                <F label="Iniciador"><input className="form-input" type="text" value={form.iniciador} onChange={(e) => s('iniciador', e.target.value)} /></F>
                <F label="Destinatarios"><input className="form-input" type="text" value={form.destinatarios} onChange={(e) => s('destinatarios', e.target.value)} /></F>
              </div>
            </Card>
            {/* <Card title="Visibilidad">
              <div className="flex gap-3">
                {[{ v: 'publico', label: 'Público', desc: 'Visible para todos' }, { v: 'privado', label: 'Privado', desc: 'Solo administradores' }].map((opt) => (
                  <label key={opt.v} className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${form.visibilidad === opt.v ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <input type="radio" name="visibilidad" value={opt.v} checked={form.visibilidad === opt.v} onChange={(e) => s('visibilidad', e.target.value)} className="accent-sky-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card> */}
          </div>
        )}

        {tab === 'almacenamiento' && (
          <div>
            <Card title="Grupos y series">
              <div className="form-grid-3">
                <F label="Grupo"><input className="form-input" type="text" value={form.grupo} onChange={(e) => s('grupo', e.target.value)} /></F>
                <F label="Serie"><input className="form-input" type="text" value={form.serie} onChange={(e) => s('serie', e.target.value)} /></F>
                <F label="Sub serie"><input className="form-input" type="text" value={form.sub_serie} onChange={(e) => s('sub_serie', e.target.value)} /></F>
              </div>
            </Card>
            <Card title="Conservación y ubicación">
              <div className="flex flex-col gap-5">
                <div className="form-grid-2">
                  <F label="Soporte"><input className="form-input" type="text" value={form.soporte} onChange={(e) => s('soporte', e.target.value)} /></F>
                  <F label="Estado de conservación"><select className="form-select" value={form.estado_conservacion} onChange={(e) => s('estado_conservacion', e.target.value)}>{ESTADOS.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Cond. de acceso"><select className="form-select" value={form.cond_acceso} onChange={(e) => s('cond_acceso', e.target.value)}>{CONDICIONES.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Cond. de reproducción"><select className="form-select" value={form.cond_reproduccion} onChange={(e) => s('cond_reproduccion', e.target.value)}>{COND_REPRO.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Lengua / Escritura"><input className="form-input" type="text" value={form.lengua_escritura} onChange={(e) => s('lengua_escritura', e.target.value)} /></F>
                  <F label="Original / Copia"><select className="form-select" value={form.original_copia} onChange={(e) => s('original_copia', e.target.value)}>{ORIG_COPIA.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Lugar destino"><input className="form-input" type="text" value={form.lugar_destino} onChange={(e) => s('lugar_destino', e.target.value)} /></F>
                  <F label="Ubicación sala"><select className="form-select" value={form.ubicacion_sala} onChange={(e) => s('ubicacion_sala', e.target.value)}>{SALAS.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">Localización exacta</p>
                  <div className="form-grid-3">
                    <F label="Pasillo"><input className="form-input" type="text" value={form.pasillo} onChange={(e) => s('pasillo', e.target.value)} /></F>
                    <F label="Estantería"><input className="form-input" type="text" value={form.estanteria} onChange={(e) => s('estanteria', e.target.value)} /></F>
                    <F label="Casillero"><input className="form-input" type="text" value={form.casillero} onChange={(e) => s('casillero', e.target.value)} /></F>
                    <F label="Caja N°"><input className="form-input" type="text" value={form.caja_nro} onChange={(e) => s('caja_nro', e.target.value)} /></F>
                    <F label="Legajo"><input className="form-input" type="text" value={form.legajo} onChange={(e) => s('legajo', e.target.value)} /></F>
                    <F label="Número"><input className="form-input" type="text" value={form.numero} onChange={(e) => s('numero', e.target.value)} /></F>
                    <F label="Folios"><input className="form-input" type="text" value={form.folios} onChange={(e) => s('folios', e.target.value)} /></F>
                    <F label="Hojas"><input className="form-input" type="text" value={form.hojas} onChange={(e) => s('hojas', e.target.value)} /></F>
                    <F label="Carillas"><input className="form-input" type="text" value={form.medidas} onChange={(e) => s('medidas', e.target.value)} /></F>
                  </div>
                </div>
              </div>
            </Card>
            <Card title="Nota del archivero">
              <textarea className="form-textarea" value={form.nota_archivero} onChange={(e) => s('nota_archivero', e.target.value)} rows={4} />
            </Card>
          </div>
        )}

        {tab === 'archivos' && (
          <div className="card-section">
            <div className="section-header">Archivos adjuntos</div>
            <div className="card-body">
              {original.archivos.length > 0 && (
                <div className="mb-4 flex flex-col gap-2">
                  {original.archivos.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-800 text-white"><FileText size={13} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{a.nombre}</p>
                        <p className="text-xs text-slate-400">{a.tipo}</p>
                      </div>
                      <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-600">Existente</span>
                    </div>
                  ))}
                </div>
              )}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                onClick={() => document.getElementById('fi-e')?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all ${dragOver ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/30'}`}
              >
                <Upload size={22} className={`mx-auto mb-2.5 ${dragOver ? 'text-sky-500' : 'text-slate-300'}`} />
                <p className="text-sm font-medium text-slate-600">Agregar nuevos archivos</p>
                <p className="mt-1 text-xs text-slate-400">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
                <input id="fi-e" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" className="hidden" onChange={(e) => addFiles(e.target.files)} />
              </div>
              {newFiles.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  {newFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-sky-100 bg-sky-50 px-4 py-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-700 text-white"><FileText size={13} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{f.name}</p>
                        <p className="text-xs text-sky-600">Nuevo — {(f.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={() => setNewFiles((fl) => fl.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Card title="Visibilidad">
              <div className="flex gap-3">
                {[{ v: 'publico', label: 'Público', desc: 'Visible para todos' }, { v: 'privado', label: 'Privado', desc: 'Solo administradores' }].map((opt) => (
                  <label key={opt.v} className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${form.visibilidad === opt.v ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <input type="radio" name="visibilidad" value={opt.v} checked={form.visibilidad === opt.v} onChange={(e) => s('visibilidad', e.target.value)} className="accent-sky-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card> 
          </div>
        )}

          
        

        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <Link href="/admin/registros" className="btn-back">Cancelar</Link>
          <div className="flex items-center gap-2.5">
            {tab !== 'datos' && <button className="btn-secondary" onClick={() => setTab(tab === 'archivos' ? 'almacenamiento' : 'datos')}> Anterior</button>}
            {tab !== 'archivos' ? (
              <button className="btn-primary" onClick={() => setTab(tab === 'datos' ? 'almacenamiento' : 'archivos')}>Siguiente</button>
            ) : (
              <button className="btn-primary" onClick={submit} disabled={saving}>
                {saving ? 'Guardando...' : <><CheckCircle size={13} /> Guardar cambios</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
