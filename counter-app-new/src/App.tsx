import React, { useState } from 'react';
import './App.css';

interface Station {
  id: number;
  name: string;
  count: number;
}

type Page = 'station-setup' | 'keypad';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('station-setup');
  const [stationCount, setStationCount] = useState<number>(0);
  const [stations, setStations] = useState<Station[]>([]);
  const [stationNames, setStationNames] = useState<string[]>([]);
  const [currentStationIndex, setCurrentStationIndex] = useState<number>(0);
  const [inputNumber, setInputNumber] = useState<string>('');

  const handleStationCountSubmit = () => {
    if (stationCount > 0) {
      const newStations: Station[] = Array.from({ length: stationCount }, (_, index) => ({
        id: index,
        name: '',
        count: 0
      }));
      setStations(newStations);
      setStationNames(new Array(stationCount).fill(''));
    }
  };

  const handleStationNameChange = (index: number, name: string) => {
    const newNames = [...stationNames];
    newNames[index] = name;
    setStationNames(newNames);
    
    const newStations = [...stations];
    newStations[index].name = name;
    setStations(newStations);
  };

  const handleStartCounting = () => {
    if (stations.every(station => station.name.trim() !== '')) {
      setCurrentStationIndex(0);
      setCurrentPage('keypad');
    }
  };

  const handleNumberInput = (digit: string) => {
    setInputNumber(prev => prev + digit);
  };

  const handleEnter = () => {
    if (inputNumber && currentStationIndex < stations.length) {
      const newStations = [...stations];
      newStations[currentStationIndex].count += parseInt(inputNumber);
      setStations(newStations);
      setInputNumber('');
      
      if (currentStationIndex < stations.length - 1) {
        setCurrentStationIndex(prev => prev + 1);
      } else {
        setCurrentStationIndex(0);
      }
    }
  };

  const handleClear = () => {
    setInputNumber('');
  };

  const handleBackspace = () => {
    setInputNumber(prev => prev.slice(0, -1));
  };

  const resetApp = () => {
    setCurrentPage('station-setup');
    setStationCount(0);
    setStations([]);
    setStationNames([]);
    setCurrentStationIndex(0);
    setInputNumber('');
  };

  if (currentPage === 'station-setup') {
    return (
      <div className="App">
        <header className="App-header">
          <h1>정류장 카운터</h1>
          
          {stationCount === 0 ? (
            <div className="station-count-input">
              <h2>정류장 개수를 입력하세요</h2>
              <input
                type="number"
                min="1"
                max="20"
                value={stationCount || ''}
                onChange={(e) => setStationCount(parseInt(e.target.value) || 0)}
                placeholder="정류장 개수"
                className="number-input"
              />
              <button 
                onClick={handleStationCountSubmit}
                disabled={stationCount <= 0}
                className="submit-btn"
              >
                확인
              </button>
            </div>
          ) : (
            <div className="station-names-input">
              <h2>정류장 이름을 입력하세요</h2>
              <div className="station-inputs">
                {stations.map((station, index) => (
                  <div key={station.id} className="station-input-group">
                    <label>정류장 {index + 1}:</label>
                    <input
                      type="text"
                      value={stationNames[index] || ''}
                      onChange={(e) => handleStationNameChange(index, e.target.value)}
                      placeholder={`정류장 ${index + 1} 이름`}
                      className="station-name-input"
                    />
                  </div>
                ))}
              </div>
              <div className="button-group">
                <button 
                  onClick={handleStartCounting}
                  disabled={!stations.every(station => station.name.trim() !== '')}
                  className="start-btn"
                >
                  카운팅 시작
                </button>
                <button 
                  onClick={() => {
                    setStationCount(0);
                    setStations([]);
                    setStationNames([]);
                  }}
                  className="reset-btn"
                >
                  다시 설정
                </button>
              </div>
            </div>
          )}
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>정류장 카운터</h1>
        
        <div className="current-station">
          <h2>현재 정류장: {stations[currentStationIndex]?.name}</h2>
          <p>현재 카운트: {stations[currentStationIndex]?.count}</p>
        </div>

        <div className="input-display">
          <div className="number-display">{inputNumber || '0'}</div>
        </div>

        <div className="keypad">
          <div className="keypad-row">
            <button className="keypad-btn" onClick={() => handleNumberInput('1')}>1</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('2')}>2</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('3')}>3</button>
          </div>
          <div className="keypad-row">
            <button className="keypad-btn" onClick={() => handleNumberInput('4')}>4</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('5')}>5</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('6')}>6</button>
          </div>
          <div className="keypad-row">
            <button className="keypad-btn" onClick={() => handleNumberInput('7')}>7</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('8')}>8</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('9')}>9</button>
          </div>
          <div className="keypad-row">
            <button className="keypad-btn" onClick={handleClear}>C</button>
            <button className="keypad-btn" onClick={() => handleNumberInput('0')}>0</button>
            <button className="keypad-btn" onClick={handleBackspace}>⌫</button>
          </div>
          <div className="keypad-row">
            <button className="enter-btn" onClick={handleEnter}>ENTER</button>
          </div>
        </div>

        <div className="station-summary">
          <h3>정류장별 카운트</h3>
          <div className="summary-list">
            {stations.map((station, index) => (
              <div key={station.id} className={`summary-item ${index === currentStationIndex ? 'current' : ''}`}>
                {station.name}: {station.count}
              </div>
            ))}
          </div>
        </div>

        <button onClick={resetApp} className="reset-app-btn">
          처음으로
        </button>
      </header>
    </div>
  );
}

export default App;
