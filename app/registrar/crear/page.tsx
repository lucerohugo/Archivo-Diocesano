'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import AppHeader from '@/components/AppHeader';

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

const INIT = {
  fecha_recepcion: new Date().toISOString().split('T')[0],
  titulo_referencia: '', descripcion_breve: '', origen: '', categoria: '',
  anio: String(new Date().getFullYear()), numero_protocolar: '', segmento: '',
  tema: '', area: '', asunto: '', iniciador: '', destinatarios: '',
  visibilidad: 'publico' as 'publico' | 'privado',
  grupo: '', serie: '', sub_serie: '', soporte: '',
  estado_conservacion: 'Excelente', cond_acceso: 'Libre', cond_reproduccion: 'Permitida',
  lengua_escritura: '', original_copia: 'Original', lugar_destino: '',
  ubicacion_sala: 'Archivo Histórico', pasillo: '', estanteria: '', casillero: '',
  caja_nro: '', legajo: '', numero: '', folios: '', hojas: '', medidas: '', nota_archivero: '',
};

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

export default function CrearRegistroPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('datos');
  const [form, setForm] = useState(INIT);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const s = (k: keyof typeof INIT, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const addFiles = (fl: FileList | null) => {
    if (fl) setFiles((p) => [...p, ...Array.from(fl)]);
  };
  const submit = async () => {
    if (!form.titulo_referencia) { alert('El título de referencia es obligatorio.'); setTab('datos'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    router.push('/admin/registros');
  };

  return (
    <div className="page-container">
      <AppHeader showAdminNav breadcrumb={[{ label: 'Panel', href: '/registrar' }, { label: 'Nuevo registro' }]} />
      <div className="content-wrapper pb-20 pt-9">
        <h1 className="mb-8 text-center text-xl font-semibold text-slate-900">
          Crear nuevo registro histórico
        </h1>

        {/* Tabs */}
        <div className="tab-nav">
          {TABS.map((t, i) => (
            <button key={t.id} className={`tab-btn${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
              <span className={`mr-2 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full text-[9px] font-bold ${tab === t.id ? 'bg-sky-800 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i + 1}
              </span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Datos principales ── */}
        {tab === 'datos' && (
          <div>
            <Card title="Datos principales de registro">
              <div className="form-grid-2">
                <F label="Fecha de recepción">
                  <input className="form-input" type="date" value={form.fecha_recepcion} onChange={(e) => s('fecha_recepcion', e.target.value)} />
                </F>
                <F label="Título referencia *">
                  <input className="form-input" type="text" value={form.titulo_referencia} onChange={(e) => s('titulo_referencia', e.target.value)} placeholder="Título del documento histórico" />
                </F>
                <F label="Descripción breve" wide>
                  <textarea className="form-textarea" value={form.descripcion_breve} onChange={(e) => s('descripcion_breve', e.target.value)} placeholder="Descripción del contenido del documento..." rows={3} />
                </F>
              </div>
            </Card>

            <Card title="Referencias y clasificación">
              <div className="form-grid-2">
                <F label="Origen">
                  <input className="form-input" type="text" value={form.origen} onChange={(e) => s('origen', e.target.value)} placeholder="Institución o persona de origen" />
                </F>
                <F label="Categoría">
                  <input className="form-input" type="text" value={form.categoria} onChange={(e) => s('categoria', e.target.value)} placeholder="Ej: Inventario, Acta, Libro sacramental..." />
                </F>
              </div>
            </Card>

            <Card title="Numeración y fechas">
              <div className="form-grid-3">
                <F label="Año">
                  <input className="form-input" type="number" value={form.anio} onChange={(e) => s('anio', e.target.value)} min="1500" max="2100" />
                </F>
                <F label="Número protocolar">
                  <input className="form-input" type="text" value={form.numero_protocolar} onChange={(e) => s('numero_protocolar', e.target.value)} />
                </F>
                <F label="Segmento">
                  <select className="form-select" value={form.segmento} onChange={(e) => s('segmento', e.target.value)}>
                    <option value="">Seleccionar</option>
                    {SEGMENTOS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </F>
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

            
          </div>
        )}

        {/* ── Tab: Almacenamiento ── */}
        {tab === 'almacenamiento' && (
          <div>
            <Card title="Grupos y series">
              <div className="form-grid-3">
                <F label="Grupo"><input className="form-input" type="text" value={form.grupo} onChange={(e) => s('grupo', e.target.value)} placeholder="Ej: Registros sacramentales" /></F>
                <F label="Serie"><input className="form-input" type="text" value={form.serie} onChange={(e) => s('serie', e.target.value)} /></F>
                <F label="Sub serie"><input className="form-input" type="text" value={form.sub_serie} onChange={(e) => s('sub_serie', e.target.value)} /></F>
              </div>
            </Card>

            <Card title="Conservación y ubicación">
              <div className="flex flex-col gap-5">
                <div className="form-grid-2">
                  <F label="Soporte"><input className="form-input" type="text" value={form.soporte} onChange={(e) => s('soporte', e.target.value)} placeholder="Ej: Papel, Pergamino..." /></F>
                  <F label="Estado de conservación"><select className="form-select" value={form.estado_conservacion} onChange={(e) => s('estado_conservacion', e.target.value)}>{ESTADOS.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Cond. de acceso"><select className="form-select" value={form.cond_acceso} onChange={(e) => s('cond_acceso', e.target.value)}>{CONDICIONES.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Cond. de reproducción"><select className="form-select" value={form.cond_reproduccion} onChange={(e) => s('cond_reproduccion', e.target.value)}>{COND_REPRO.map((v) => <option key={v} value={v}>{v}</option>)}</select></F>
                  <F label="Lengua / Escritura"><input className="form-input" type="text" value={form.lengua_escritura} onChange={(e) => s('lengua_escritura', e.target.value)} placeholder="Ej: Español, Latín..." /></F>
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
                    <F label="Medidas"><input className="form-input" type="text" value={form.medidas} onChange={(e) => s('medidas', e.target.value)} placeholder="Ej: 22x32 cm" /></F>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Nota del archivero">
              <textarea className="form-textarea" value={form.nota_archivero} onChange={(e) => s('nota_archivero', e.target.value)} rows={4} placeholder="Observaciones del archivero..." />
            </Card>
          </div>
        )}

        {/* ── Tab: Archivos ── */}
        {tab === 'archivos' && (
          <div className="card-section">
            <div className="section-header">Archivos adjuntos</div>
            <div className="card-body">
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                onClick={() => document.getElementById('fi')?.click()}
                className={`mb-4 cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all ${dragOver ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50 hover:border-sky-300 hover:bg-sky-50/30'}`}
              >
                <Upload size={26} className={`mx-auto mb-3 ${dragOver ? 'text-sky-500' : 'text-slate-300'}`} />
                <p className="text-sm font-medium text-slate-600">
                  {dragOver ? 'Suelte los archivos aquí' : 'Haga clic o arrastre archivos aquí'}
                </p>
                <p className="mt-1 text-xs text-slate-400">PDF, DOC, DOCX, XLS, XLSX, JPG, PNG</p>
                <input id="fi" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" className="hidden" onChange={(e) => addFiles(e.target.files)} />
              </div>

              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-800 text-white">
                        <FileText size={13} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{f.name}</p>
                        <p className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={() => setFiles((fl) => fl.filter((_, j) => j !== i))} className="text-slate-400 transition-colors hover:text-red-500">
                        <X size={14} />
                      </button>
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




        {/* Footer nav */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
          <Link href="/registrar" className="btn-back">Cancelar y salir</Link>
          <div className="flex items-center gap-2.5">
            {tab !== 'datos' && (
              <button className="btn-secondary" onClick={() => setTab(tab === 'archivos' ? 'almacenamiento' : 'datos')}>
                Anterior
              </button>
            )}
            {tab !== 'archivos' ? (
              <button className="btn-primary" onClick={() => setTab(tab === 'datos' ? 'almacenamiento' : 'archivos')}>
                Siguiente
              </button>
            ) : (
              <button className="btn-primary" onClick={submit} disabled={saving}>
                {saving ? 'Guardando...' : <><CheckCircle size={13} /> Aceptar y confirmar registro</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
