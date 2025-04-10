import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import {Camera, CameraResultType} from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor() {}

  takePhoto =async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });
    console.log(image.dataUrl);
  };

  
  async scheduleNotification(title: string, body: string) {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.warn('Permisos de notificación no concedidos');
      return;
    }
  
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Date.now(), // ID único basado en timestamp
          schedule: { at: new Date(Date.now() + 1000) }, // 1 segundo después
          sound: 'beep.aiff',
          smallIcon: 'ic_stat_icon_config_sample',
          actionTypeId: '',
        },
      ],
    });
  }

  async lanzarNotificacion() {
    await this.scheduleNotification('Recordatorio', 'Tienes una tutoría en 10 minutos!');
  }


  async getCurrentPosition() {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') {
        console.warn('Permiso de ubicación no concedido');
        return null;
      }
  
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      return null;
    }
  }

}
