import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Loading from './components/Loading';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 36],
  iconAnchor: [17, 46]
});

L.Marker.prototype.options.icon = DefaultIcon;

function App() {
  const [info, setInfo] = useState<any>({});
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const getInfo = async () => {
    const info = await axios.get('https://ipapi.co/json/').then(x => { return x.data });
    setInfo(info);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      })
    }
    setIsLoaded(true);
  }

  const copyText = (e: any) => {
    navigator.clipboard.writeText(e.target.innerText);
    return (
      <Tooltip direction='right' opacity={1}>
        copied!
      </Tooltip>
    )
  }

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    const checkPopup = () => {
      const popupElement = document.getElementsByClassName('xxxxx')[0];
      setIsPopupVisible(!!popupElement);
    }
    const intervalId = setInterval(checkPopup, 100);
    return () => {
      clearInterval(intervalId);
    }
  }, [])

  return (
    <div className='bg-body-secondary position-relative w-100 vh-100'>
      {
        !isLoaded ?
          <Loading /> :
          latitude !== 0 &&
          <div className='w-100 h-100'>
            <MapContainer className='z-0' center={[latitude, longitude]} zoom={15} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitude, longitude]}>
                {
                  !isPopupVisible &&
                  <Tooltip direction="bottom" offset={[-3, -5]} opacity={1} permanent className='border-black rounded-2'>click/tap on the marker for details</Tooltip>
                }
                <Popup offset={[-5, -40]} className='xxxxx' closeButton={false}>
                  <ListGroup>
                    <ListGroup.Item>
                      <div className='rows'>
                        <span className='me-2 text-primary'>IP:</span>
                        <span role='button' onClick={copyText}>{info.ip}</span>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className='rows'>
                        <span className='me-2 text-primary'>City:</span>
                        <span role='button' onClick={copyText}>{info.city}</span>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className='rows'>
                        <span className='me-2 text-primary'>Latitude:</span>
                        <span role='button' onClick={copyText}>{info.latitude}</span>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <div className='rows'>
                        <span className='me-2 text-primary'>Longitude:</span>
                        <span role='button' onClick={copyText}>{info.longitude}</span>
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <div className='rows'>
                        <span className='me-2 text-primary'>Country:</span>
                        <span role='button' onClick={copyText}>{info.country_name}</span>
                      </div>
                    </ListGroup.Item>
                    <span className='text-muted d-flex w-100 justify-content-center mt-1'>*approximate location</span>
                  </ListGroup>
                </Popup>
              </Marker>
            </MapContainer>
            <footer className='position-absolute w-100 bottom-0 d-block z-1 text-center text-white py-1'>Developed by <a href="https://www.linkedin.com/in/piyaremen/" target='_blank' rel='noopener noreferrer'>Piyar Emen</a></footer>
          </div>
      }

    </div>
  );
}

export default App;
