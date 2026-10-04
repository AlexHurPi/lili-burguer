import catalogData from '../languages/spanish.json'; // 👈 Ajusta la ruta a tu spanish.json si es diferente

/**
 * Convierte una cadena de hora "HH:mm" a minutos transcurridos desde medianoche (0 a 1439).
 */
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Función principal que evalúa si la tienda está abierta o cerrada en tiempo real.
 * @param {Object} customStoreStatus - (Opcional) Objeto storeStatus del JSON si se pasa explícitamente.
 * @returns {Object} { isOpen, bannerMessage, scheduledHeader, closedNotice }
 */
export const getStoreStatus = (customStoreStatus = catalogData?.storeStatus) => {
  // Retorno preventivo si no existe la configuración
  if (!customStoreStatus) {
    return {
      isOpen: false,
      bannerMessage: "🔴 Tienda Cerrada",
      scheduledHeader: "📌 *PEDIDO PROGRAMADO*",
      closedNotice: "En este momento la tienda se encuentra cerrada."
    };
  }

  const { manualOverride, schedule, messages } = customStoreStatus;

  // 1. Filtro de Sobreescritura Manual
  if (manualOverride === 'force_open') {
    return {
      isOpen: true,
      bannerMessage: messages?.openBanner || "🟢 ¡Estamos Abiertos!",
      scheduledHeader: messages?.scheduledOrderHeader || "",
      closedNotice: messages?.closedCartNotice || ""
    };
  }

  if (manualOverride === 'force_closed') {
    return {
      isOpen: false,
      bannerMessage: messages?.closedBanner || "🔴 Tienda Cerrada",
      scheduledHeader: messages?.scheduledOrderHeader || "",
      closedNotice: messages?.closedCartNotice || ""
    };
  }

  // 2. Obtener fecha y hora actual del dispositivo
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let isOpen = false;

  // 3. Evaluamos la jornada programada para el DÍA ACTUAL
  const todaySchedule = schedule?.find((s) => s.day === currentDay);

  if (todaySchedule && todaySchedule.isOpen) {
    const openMin = parseTimeToMinutes(todaySchedule.openTime);
    const closeMin = parseTimeToMinutes(todaySchedule.closeTime);

    if (closeMin > openMin) {
      // Jornada normal (Ejemplo: Domingo a Jueves de 16:00 a 23:00)
      if (currentMinutes >= openMin && currentMinutes < closeMin) {
        isOpen = true;
      }
    } else if (closeMin < openMin) {
      // Jornada de trasnoche (Ejemplo: Viernes de 16:00 a 01:00) - Tramo de la tarde/noche
      if (currentMinutes >= openMin) {
        isOpen = true;
      }
    }
  }

  // 4. Evaluamos si venimos en la MADRUGADA del DÍA ANTERIOR (Trasnoche de Viernes/Sábado)
  if (!isOpen) {
    const yesterdayDay = (currentDay + 6) % 7; // Obtiene el día anterior en ciclo 0-6
    const yesterdaySchedule = schedule?.find((s) => s.day === yesterdayDay);

    if (yesterdaySchedule && yesterdaySchedule.isOpen) {
      const openMin = parseTimeToMinutes(yesterdaySchedule.openTime);
      const closeMin = parseTimeToMinutes(yesterdaySchedule.closeTime);

      // Si la jornada de ayer cruzaba la medianoche (Ejemplo: 16:00 a 01:00)
      if (closeMin < openMin) {
        if (currentMinutes < closeMin) {
          isOpen = true;
        }
      }
    }
  }

  // 5. Devolvemos el resultado consolidado
  return {
    isOpen,
    bannerMessage: isOpen ? messages?.openBanner : messages?.closedBanner,
    scheduledHeader: messages?.scheduledOrderHeader,
    closedNotice: messages?.closedCartNotice
  };
};