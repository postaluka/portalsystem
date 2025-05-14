import PARAMS from "./PARAMS";


export default class ScrollSpeed
{
  constructor()
  {
    this.lastProgress = 0;

  }

  onUpdate(self)
  {
    const target = gsap.utils.mapRange(0, 1, 0, 2, self.progress);

    let delta = target - (this.lastProgress || 0);
    this.lastProgress = target;

    // Якщо скрол назад — не додаємо імпульс
    if (delta <= 0) return;

    // Маленький поріг, щоб не ловити мікроскопічні рухи
    if (Math.abs(delta) < 0.0001)
      return;

    // ТУТ КОНТРОЛЮЄМО ШВІДКІСТЬ СКРОЛА (ЗМІНЮЮЧИ КОЕФІЦІЄНТ МОЖЕННЯ)
    const impulse = delta * 0.002;

    PARAMS.angularVelocity += impulse;

    // --- ПРУЖНІСТЬ: якщо імпульс достатній, додаємо bounce ефект ---
    if (Math.abs(impulse) > 0.01)
    {
      gsap.to(PARAMS, {
        angularVelocity: PARAMS.angularVelocity + impulse * 0.1, //КОЕФІЦІЄНТ ІМПУЛЬСУ МОЖНА РЕДАГУВАТИ
        duration: 0.4,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto"
      });
    }
  }
}



// onUpdate: (self) =>
// {
//   const target = gsap.utils.mapRange(0, 1, 0, 2.7, self.progress);

//   // Рахуємо різницю з попереднім прогресом (швидкість скролу)
//   const delta = target - (PARAMS._prevProgress || 0);
//   PARAMS._prevProgress = target;

//   // Якщо різниця є — додаємо імпульс
//   PARAMS.angularVelocity += delta * 0.05; // 0.05 = коефіцієнт імпульсу (регулюється)
// }


//let lastProgress = 0;

// onUpdate: (self) =>
//   {
//     const target = gsap.utils.mapRange(0, 1, 0, 2, self.progress);

//     const delta = target - (PARAMS._prevProgress || 0);
//     PARAMS._prevProgress = target;

//     // Додаємо імпульс
//     const impulse = delta * 0.05;

//     PARAMS.angularVelocity += impulse;

//     // --- ПРУЖНІСТЬ: якщо імпульс достатньо великий, додаємо bounce ефект ---
//     if (Math.abs(impulse) > 0.01) // поріг, щоб не реагувати на дуже маленькі скроли
//     {
//       // Створюємо короткий tween, який додає додаткову "пружність"
//       gsap.to(PARAMS, {
//         angularVelocity: PARAMS.angularVelocity + impulse * 0.5, // трохи перебільшуємо
//         duration: 0.4,
//         ease: "elastic.out(1, 0.5)", // можна ще "bounce.out" спробувати
//         overwrite: "auto"
//       });
//     }
//   }