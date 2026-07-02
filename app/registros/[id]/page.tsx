'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, MapPin, FileText, Archive, Download, AlertCircle } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { getRegistroById } from '@/lib/mock-data';

function Field({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

export default function RegistroDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const r = getRegistroById(id);

  if (!r || r.visibilidad === 'privado') {
    return (
      <div className="page-container">
        <AppHeader />
        <div className="mx-auto max-w-md py-24 text-center">
          <AlertCircle size={36} className="mx-auto mb-4 text-slate-300" />
          <h2 className="mb-2 text-xl font-semibold text-slate-700">Registro no encontrado</h2>
          <p className="mb-6 text-sm text-slate-500">
            Este registro no existe o no está disponible públicamente.
          </p>
          <Link href="/registros" className="btn-primary">Volver al archivo</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <AppHeader breadcrumb={[{ label: 'Registros', href: '/registros' }, { label: `N° ${r.codigo}` }]} />
      <div className="content-wrapper pb-16 pt-10">
        {/* Page header */}
        <div className="page-header">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded border border-sky-100 bg-sky-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700">
              {r.categoria}
            </span>
            <span className="text-xs text-slate-400">Registro N° {r.codigo}</span>
          </div>
          <h1 className="max-w-10xl text-2xl font-semibold leading-snug text-slate-900">
            {r.titulo_referencia}
          </h1>
          {r.descripcion_breve && (
            <p className="mt-3 max-w-10xl text-sm leading-relaxed text-slate-500">
              {r.descripcion_breve}
            </p>
          )}
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-6">
          {/* Main */}
          <div>
            {/* Datos principales */}
            <div className="card-section">
              <div className="section-header flex items-center gap-2">
                <BookOpen size={11} />
                Datos principales
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Año del documento" value={r.anio} />
                  <Field label="Fecha de recepción" value={r.fecha_recepcion} />
                  <Field label="Origen" value={r.origen} />
                  <Field label="Categoría" value={r.categoria} />
                  <Field label="N° Protocolar" value={r.numero_protocolar} />
                  <Field label="Segmento" value={r.segmento} />
                  {r.tema && <Field label="Tema" value={r.tema} />}
                  {r.area && <Field label="Área" value={r.area} />}
                  {r.asunto && <div className="col-span-2"><Field label="Asunto" value={r.asunto} /></div>}
                  {r.iniciador && <Field label="Iniciador" value={r.iniciador} />}
                  {r.destinatarios && <Field label="Destinatarios" value={r.destinatarios} />}
                </div>
              </div>
            </div>

            {/* Conservación */}
            <div className="card-section">
              <div className="section-header flex items-center gap-2">
                <Archive size={11} />
                Conservación y características
              </div>
              <div className="card-body">
                <div className="grid grid-cols-3 gap-5">
                  <Field label="Soporte" value={r.soporte} />
                  <Field label="Estado de conservación" value={r.estado_conservacion} />
                  <Field label="Lengua / Escritura" value={r.lengua_escritura} />
                  <Field label="Original / Copia" value={r.original_copia} />
                  <Field label="Condición de acceso" value={r.cond_acceso} />
                  <Field label="Cond. reproducción" value={r.cond_reproduccion} />
                  {r.folios && <Field label="Folios" value={r.folios} />}
                  {r.hojas && <Field label="Hojas" value={r.hojas} />}
                  {r.medidas && <Field label="Carillas" value={r.medidas} />}
                </div>
              </div>
            </div>

            {/* Archivos */}
            {r.archivos.length > 0 && (
              <div className="card-section">
                <div className="section-header flex items-center gap-2">
                  <FileText size={11} />
                  Archivos adjuntos ({r.archivos.length})
                </div>
                <div className="card-body flex flex-col gap-2">
                  {r.archivos.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-800 text-white">
                        <FileText size={13} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{a.nombre}</p>
                        <p className="text-xs text-slate-400">{a.tipo}</p>
                      </div>
                      <button className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 hover:text-sky-800 transition-colors">
                        <Download size={12} />
                        Descargar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="card-section">
              <div className="section-header flex items-center gap-2">
                <MapPin size={11} />
                Ubicación física
              </div>
              <div className="card-body flex flex-col gap-4">
                <Field label="Sala" value={r.ubicacion_sala} />
                <Field label="Grupo" value={r.grupo} />
                <Field label="Serie" value={r.serie} />
                {r.sub_serie && <Field label="Sub serie" value={r.sub_serie} />}
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                  {r.pasillo && <Field label="Pasillo" value={r.pasillo} />}
                  {r.estanteria && <Field label="Estantería" value={r.estanteria} />}
                  {r.casillero && <Field label="Casillero" value={r.casillero} />}
                  {r.caja_nro && <Field label="Caja N°" value={r.caja_nro} />}
                  {r.legajo && <Field label="Legajo" value={r.legajo} />}
                  {r.numero && <Field label="N° Registro" value={r.numero} />}
                </div>
              </div>
            </div>

            {r.nota_archivero && (
              <div className="card-section">
                <div className="section-header">Nota del archivero</div>
                <div className="card-body">
                  <p className="text-xs italic leading-relaxed text-slate-500">
                    &ldquo;{r.nota_archivero}&rdquo;
                  </p>
                </div>
              </div>
            )}

            <Link href="/registros" className="btn-back flex w-full justify-center">
              Volver al archivo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
