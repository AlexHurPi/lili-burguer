import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useMenu } from '../../../context/MenuContext';

const StoreScheduleControl = () => {
  const { menuData } = useMenu();
  const [schedule, setSchedule] = useState([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Cargar datos del horario semanal desde MenuContext
  useEffect(() => {
    if (menuData?.storeStatus?.schedule) {
      setSchedule(JSON.parse(JSON.stringify(menuData.storeStatus.schedule)));
    }
  }, [menuData]);

  // Cambiar disponibilidad de un día específico (isOpen)
  const handleToggleDay = (index) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        isOpen: !updated[index].isOpen
      };
      return updated;
    });
  };

  // Cambiar hora de apertura u hora de cierre
  const handleTimeChange = (index, field, value) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Guardar el horario semanal en Firestore
  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });

    try {
      const docRef = doc(db, 'menu', 'spanish');
      await updateDoc(docRef, {
        'storeStatus.schedule': schedule
      });

      setFeedback({
        type: 'success',
        text: '¡Horario semanal actualizado en tiempo real en la base de datos!'
      });
    } catch (error) {
      console.error('Error al guardar el horario:', error);
      setFeedback({
        type: 'error',
        text: 'Error al actualizar el horario. Intenta nuevamente.'
      });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
    }
  };

  if (!schedule || schedule.length === 0) {
    return <p className="loading-schedule-text">Cargando horario semanal...</p>;
  }

  return (
    <div className="store-schedule-container">
      <details className="admin-collapsible-section">
        <summary className="collapsible-title">
          <strong>📅 Horario Semanal de Atención</strong>
          <span>Configurar días y horas de apertura</span>
        </summary>

        <form onSubmit={handleSaveSchedule} className="collapsible-content">
          {feedback.text && (
            <div className={`status-alert-banner ${feedback.type}`}>
              {feedback.text}
            </div>
          )}

          <div className="schedule-days-list">
            {schedule.map((dayItem, index) => (
              <div
                key={dayItem.day}
                className={`schedule-day-row ${dayItem.isOpen ? 'day-open' : 'day-closed'}`}
              >
                {/* Switch + Nombre del día */}
                <div className="day-info-toggle">
                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={dayItem.isOpen}
                      onChange={() => handleToggleDay(index)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className="day-name">{dayItem.dayName}</span>
                </div>

                {/* Horarios de Apertura y Cierre */}
                {dayItem.isOpen ? (
                  <div className="day-time-inputs">
                    <div className="time-field">
                      <small>Abre:</small>
                      <input
                        type="time"
                        value={dayItem.openTime || '16:00'}
                        onChange={(e) => handleTimeChange(index, 'openTime', e.target.value)}
                      />
                    </div>
                    <span className="time-separator">-</span>
                    <div className="time-field">
                      <small>Cierra:</small>
                      <input
                        type="time"
                        value={dayItem.closeTime || '23:00'}
                        onChange={(e) => handleTimeChange(index, 'closeTime', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="closed-badge-text">🔴 CERRADO TODO EL DÍA</span>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="btn-save-store-status"
            disabled={saving}
            style={{ marginTop: '16px' }}
          >
            {saving ? 'Guardando horario en Firestore...' : '💾 GUARDAR HORARIO SEMANAL'}
          </button>
        </form>
      </details>
    </div>
  );
};

export default StoreScheduleControl;