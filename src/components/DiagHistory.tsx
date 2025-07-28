import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const FRONT_PARAMS = [
  'Передние амортизаторы',
  'Пыльники / отбойники',
  'Опоры амортизаторов',
  'Подшипники амортизаторов',
  'Пружины амортизаторов',
  'Привод / ШРУС / Пыльник',
  'Рулевой наконечник/пыльник',
  'Рулевая тяга/пыльник',
  'Рулевая рейка',
  'Рычаги подвески нижние/верхние',
  'Сайлентблоки перед/задние',
  'Стойки/втулки стабилизатора',
  'Ступичный подшипник',
  'Тормозные диски',
  'Тормозные колодки',
  'Тормозные шланги/трубки',
  'Рем-комплект суппортов/профилактика',
  'Трос ручного тормоза',
  'Шины/колесный диск (состояние)',
  'Шины/колесный диск (соответствие)',
  'Фактическая толщина диска (мм), минимум (мм)',
  'Фактическая толщина колодки (мм), минимум (мм)',
];
const REAR_PARAMS = [
  'Задние амортизаторы',
  'Пыльники / отбойники',
  'Опоры амортизаторов',
  'Пружины / рессоры',
  'Стойки/втулки стабилизатора',
  'Рычаги подвески вверх/низ',
  'Шаровые опоры нижние/верхние',
  'Ступичный подшипник',
  'Сайлентблоки подрамника',
  'Тяги поперечные/продольные',
  'Кардан-вал / крестовины / ШРУС',
  'Тормозные диски/барабаны',
  'Тормозные колодки',
  'Тормозные шланги/трубки',
  'Рем-комплект суппортов/профилактика',
  'Трос ручного тормоза',
  'Шины/колесный диск (состояние)',
  'Шины/колесный диск (соответствие)',
  'Фактическая толщина диска (мм), минимум (мм)',
  'Фактическая толщина колодки (мм), минимум (мм)',
];
const STATE_LABELS: Record<string, string> = {
  ok: 'ОК',
  recommend: 'Рекомендация',
  replace: 'Замена',
  '': '—',
};

function DetailsModal({ item, onClose }: { item: any, onClose: () => void }) {
  const contentRef = useRef<HTMLDivElement>(null);

  async function handleExportPDF() {
    if (!contentRef.current) return;
    const canvas = await html2canvas(contentRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`diagnostic-sheet-${item.date || ''}-${item.client || ''}.pdf`);
  }

  if (!item) return null;
  return (
    <div style={{position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: '#fff', borderRadius: 12, padding: 32, maxWidth: 700, width: '100%', boxShadow: '0 4px 32px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto'}}>
        <div ref={contentRef}>
          <h2 style={{marginTop: 0}}>Детали диагностического листа</h2>
          <div style={{marginBottom: 12}}><b>Дата:</b> {item.date || '-'} | <b>Клиент:</b> {item.client || '-'} | <b>Госномер:</b> {item.regnum || '-'}</div>
          <div style={{marginBottom: 12}}><b>Автомобиль:</b> {item.car || '-'} | <b>VIN:</b> {item.vin || '-'}</div>
          <div style={{marginBottom: 12}}><b>Исполнитель:</b> {item.executor || '-'} | <b>Номер заказа:</b> {item.order || '-'}</div>
          <div style={{marginBottom: 12}}><b>Тип передней подвески:</b> {item.frontSuspensionType || '-'} | <b>Тип задней подвески:</b> {item.rearSuspensionType || '-'}</div>
          <div className="section-title" style={{marginTop: 24}}>Передняя подвеска</div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.98em'}}>
            <thead>
              <tr style={{background: '#f5f5f5'}}>
                <th style={{padding: 6}}>Параметр</th>
                <th style={{padding: 6}}>Левая</th>
                <th style={{padding: 6}}>Правая</th>
                <th style={{padding: 6}}>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {FRONT_PARAMS.map((param, idx) => (
                <tr key={param} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: 6}}>{param}</td>
                  <td style={{padding: 6}}>{STATE_LABELS[item[`front_left_${idx}`] || '']}</td>
                  <td style={{padding: 6}}>{STATE_LABELS[item[`front_right_${idx}`] || '']}</td>
                  <td style={{padding: 6}}>{item[`front_comment_${idx}`] || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="section-title" style={{marginTop: 24}}>Задняя подвеска</div>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.98em'}}>
            <thead>
              <tr style={{background: '#f5f5f5'}}>
                <th style={{padding: 6}}>Параметр</th>
                <th style={{padding: 6}}>Левая</th>
                <th style={{padding: 6}}>Правая</th>
                <th style={{padding: 6}}>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {REAR_PARAMS.map((param, idx) => (
                <tr key={param} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: 6}}>{param}</td>
                  <td style={{padding: 6}}>{STATE_LABELS[item[`rear_left_${idx}`] || '']}</td>
                  <td style={{padding: 6}}>{STATE_LABELS[item[`rear_right_${idx}`] || '']}</td>
                  <td style={{padding: 6}}>{item[`rear_comment_${idx}`] || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="section-title" style={{marginTop: 24}}>Технические жидкости</div>
          <ul style={{margin: 0, padding: 0, listStyle: 'none', fontSize: '1em'}}>
            <li>Уровень масла ДВС: {item.oil ? 'Да' : 'Нет'}</li>
            <li>Тормозная жидкость: {item.brake ? 'Да' : 'Нет'}</li>
            <li>Жидкость ГУР: {item.gur ? 'Да' : 'Нет'}</li>
            <li>Антифриз: {item.antifreeze ? 'Да' : 'Нет'}</li>
          </ul>
          <div style={{marginBottom: 12}}><b>Спец. отметки:</b> {item.special_notes || '-'}</div>
          <div style={{marginBottom: 12}}><b>Подпись:</b> {item.signature || '-'}</div>
          <div style={{marginBottom: 12, fontSize: '0.95em', color: '#888'}}>Сохранено: {item.created ? new Date(item.created).toLocaleString() : '-'}</div>
        </div>
        <div style={{display: 'flex', gap: 16, marginTop: 24}}>
          <button className="button" onClick={onClose}>Закрыть</button>
          <button className="button" type="button" onClick={handleExportPDF}>Экспорт в PDF</button>
        </div>
      </div>
    </div>
  );
}

export function DiagHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('diag_history') || '[]');
    setHistory(data.reverse());
  }, []);

  const filtered = history.filter(item =>
    (!search ||
      (item.client && item.client.toLowerCase().includes(search.toLowerCase())) ||
      (item.regnum && item.regnum.toLowerCase().includes(search.toLowerCase()))
    )
  );

  return (
    <div>
      <div className="section-title">История диагностических листов</div>
      <input
        type="text"
        placeholder="Поиск по ФИО клиента или госномеру..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom: 24}}
      />
      {filtered.length === 0 && <div style={{color: '#888', margin: '32px 0'}}>Нет сохранённых листов</div>}
      <div style={{maxHeight: 400, overflowY: 'auto'}}>
        {filtered.map((item, idx) => (
          <div key={idx} style={{border: '1px solid #eee', borderRadius: 8, marginBottom: 16, padding: 16, cursor: 'pointer'}} onClick={() => setSelected(item)}>
            <div><b>Дата:</b> {item.date || '-'} | <b>Клиент:</b> {item.client || '-'} | <b>Госномер:</b> {item.regnum || '-'}</div>
            <div style={{fontSize: '0.95em', color: '#888'}}>Сохранено: {item.created ? new Date(item.created).toLocaleString() : '-'}</div>
          </div>
        ))}
      </div>
      {selected && <DetailsModal item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
} 