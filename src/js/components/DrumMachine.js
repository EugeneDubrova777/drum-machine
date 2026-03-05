export default function DrumMachine() {

  const tracks = [
    { id: 'bass', name: 'BASS', color: '#3e3939' },
    { id: 'snare', name: 'SNARE', color: '#605c54' },
    { id: 'ride', name: 'RIDE', color: '#3b554d' },
    { id: 'tom', name: 'TOM', color: '#403d6b' },
    { id: 'crash', name: 'CRASH', color: '#643838' }
  ];

  const NUM_STEPS = 8;


  return (
    <div className="drum-machine"></div>
  )
}