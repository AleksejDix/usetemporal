<template>
  <section class="dst-card">
    <div class="dst-card__section dst-card__section--top">
      <div class="clock-wrapper">
        <svg viewBox="-50 -50 100 100" class="clock">
          <circle class="clock-face" r="48" />
          <line class="clock-tick" v-for="tick in 12" :key="tick" :x1="0" y1="-44" :x2="0" y2="-48" :transform="`rotate(${tick * 30})`" />
          <path class="clock-wedge" d="M0 0 L35 20 A40 40 0 0 1 35 0 Z" />
          <line class="hand hand--hour" x1="0" y1="0" x2="0" y2="-20" />
          <line class="hand hand--minute" x1="0" y1="0" x2="32" y2="10" />
          <circle class="clock-center" r="2" />
        </svg>
      </div>
      <div class="dst-card__text">
        <h4>Spring Forward</h4>
        <p>Clocks jump from 2:00 to 3:00 a.m. in one move.</p>
      </div>
    </div>

    <div class="dst-card__section dst-card__section--bottom">
      <div class="clock-wrapper">
        <svg viewBox="-50 -50 100 100" class="clock">
          <circle class="clock-face" r="48" />
          <line class="clock-tick" v-for="tick in 12" :key="`b-${tick}`" :x1="0" y1="-44" :x2="0" y2="-48" :transform="`rotate(${tick * 30})`" />
          <path class="clock-wedge" d="M0 0 L35 0 A40 40 0 0 1 35 -20 Z" />
          <line class="hand hand--hour" x1="0" y1="0" x2="0" y2="-20" />
          <line class="hand hand--minute" x1="0" y1="0" x2="32" y2="-10" />
          <circle class="clock-center" r="2" />
        </svg>
      </div>
      <div class="dst-card__text">
        <h4>Don't forget</h4>
        <p>Set clocks ahead by one hour at 2:00 a.m. Sunday.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dst-card {
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 640px;
  margin: 0 auto;
  font-size: 1rem;
  color: #1b1d36;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.dst-card__section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.dst-card__section--top {
  background: linear-gradient(180deg, #ffd54f 0%, #fca311 100%);
}

.dst-card__section--bottom {
  background: #f0f0f0;
}

.clock-wrapper {
  flex-shrink: 0;
}

.clock {
  width: 160px;
  height: 160px;
}

.clock-face {
  fill: #fff;
  stroke: #1f2a44;
  stroke-width: 4;
}

.clock-tick {
  stroke: #1f2a44;
  stroke-width: 2;
  stroke-linecap: round;
}

.clock-wedge {
  fill: rgba(255, 163, 110, 0.6);
  stroke: none;
}

.hand {
  stroke: #1f2a44;
  stroke-width: 4;
  stroke-linecap: round;
}

.hand--minute {
  stroke-width: 3;
}

.clock-center {
  fill: #f0a202;
}

.dst-card__text h4 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.dst-card__text p {
  margin: 0.5rem 0 0;
  font-size: 1rem;
}

@media (max-width: 640px) {
  .dst-card__section {
    flex-direction: column;
    text-align: center;
  }
}
</style>
