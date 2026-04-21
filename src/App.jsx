import { useState } from 'react'
import DateNav, { todayStr } from './components/DateNav'
import LogSection from './components/LogSection'
import Toggle from './components/Toggle'
import FieldInput from './components/FieldInput'
import { useLog } from './hooks/useLog'

export default function App() {
  const [date, setDate] = useState(todayStr)
  const { log, update } = useLog(date)

  const n = (field, value) => update('night', field, value)
  const m = (field, value) => update('morning', field, value)
  const b = (field, value) => update('bodyAndDay', field, value)

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-name">Life Log</span>
        <DateNav date={date} onChange={setDate} />
      </header>

      <main className="app-main">
        <LogSection title="Night">
          <Toggle label="Red lights" checked={log.night.redLights} onChange={v => n('redLights', v)} />
          <Toggle label="Blue light glasses" checked={log.night.blueLightGlasses} onChange={v => n('blueLightGlasses', v)} />
          <Toggle label="Phone away from bed" checked={log.night.phoneAwayFromBed} onChange={v => n('phoneAwayFromBed', v)} />
          <FieldInput label="Sleep time" type="time" value={log.night.sleepTime} onChange={v => n('sleepTime', v)} />
          <FieldInput label="Wake time" type="time" value={log.night.wakeTime} onChange={v => n('wakeTime', v)} />
        </LogSection>

        <LogSection title="Morning">
          <Toggle label="Off phone 45 min" checked={log.morning.offPhone45} onChange={v => m('offPhone45', v)} />
          <Toggle label="Outside and breathe" checked={log.morning.outsideBreathe} onChange={v => m('outsideBreathe', v)} />
          <Toggle label="Meditation" checked={log.morning.meditation} onChange={v => m('meditation', v)} />
          <Toggle label="Reading" checked={log.morning.reading} onChange={v => m('reading', v)} />
          <Toggle label="Journaling" checked={log.morning.journaling} onChange={v => m('journaling', v)} />
          <Toggle label="Supplements" checked={log.morning.supplements} onChange={v => m('supplements', v)} />
        </LogSection>

        <LogSection title="Body & Day">
          <FieldInput label="Exercise" value={log.bodyAndDay.exercise} onChange={v => b('exercise', v)} placeholder="What and how long" />
          <FieldInput label="Eating" value={log.bodyAndDay.eating} onChange={v => b('eating', v)} placeholder="How did you eat today" />
          <FieldInput label="University" value={log.bodyAndDay.university} onChange={v => b('university', v)} placeholder="What you worked on" />
          <FieldInput label="Coding" value={log.bodyAndDay.coding} onChange={v => b('coding', v)} placeholder="What you built" />
          <FieldInput label="Pages read" type="number" value={log.bodyAndDay.pagesRead} onChange={v => b('pagesRead', v)} placeholder="0" />
          <Toggle label="Stretching" checked={log.bodyAndDay.stretching} onChange={v => b('stretching', v)} />
          <Toggle label="Talked to parents" checked={log.bodyAndDay.talkingToParents} onChange={v => b('talkingToParents', v)} />
        </LogSection>
      </main>
    </div>
  )
}
