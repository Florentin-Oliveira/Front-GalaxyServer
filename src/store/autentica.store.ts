import { makeObservable, observable, action } from "mobx";
import http from '../http';
import { IUser } from "../Interface/IUser";
import { NavigateFunction } from 'react-router-dom';

class AutenticaStore {
  estaAutenticado = false;
  usuario: IUser = { id: 0, username: "", token: "", expirationTime: 0 };
  navigate: NavigateFunction | null = null;
  sessionExpired = false;

  constructor() {
    makeObservable(this, {
      estaAutenticado: observable,
      usuario: observable,
      sessionExpired: observable,
      login: action,
      logout: action,
      refreshToken: action,
      setAuthData: action,
      clearAuthData: action,
      initializeAuth: action,
      handle401: action,
      fetchUserId: action,
    });

    this.initializeAuth();
  }

  setNavigateFunction(navigate: NavigateFunction) {
    this.navigate = navigate;
  }

  login({ id, username, token, expirationTime }: IUser) {
    console.log('Login attempt:', { id, username, token, expirationTime });
    this.sessionExpired = false;
    this.setAuthData(id ?? 0, username, token, expirationTime ?? 0);
  }

  logout() {
    console.log('Logging out user:', this.usuario.username);
    this.clearAuthData();
    if (this.navigate) {
      this.navigate('/login');
    }
  }

  setAuthData(id: number, username: string, token: string, expirationTime: number) {
    console.log('Setting auth data:', { id, username, token, expirationTime });
    this.estaAutenticado = true;
    this.usuario = { id, username, token, expirationTime };
    localStorage.setItem('id', id.toString());
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime.toString());

    setTimeout(() => {
      this.checkSessionExpired();
    }, expirationTime - Date.now());
  }

  clearAuthData() {
    console.log('Clearing auth data');
    this.estaAutenticado = false;
    this.usuario = { id: 0, username: "", token: "", expirationTime: 0 };
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
  }

  initializeAuth() {
    const id = parseInt(localStorage.getItem('id') || "0");
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    const expirationTimeString = localStorage.getItem('expirationTime');
    const expirationTime = expirationTimeString ? parseInt(expirationTimeString, 10) : 0;

    console.log('Initializing auth:', { id, username, token, expirationTime });

    if (token && username && expirationTime > Date.now()) {
      this.setAuthData(id, username, token, expirationTime);
    } else {
      this.clearAuthData();
    }
  }

  checkSessionExpired() {
    if (this.usuario.expirationTime <= Date.now()) {
      this.handle401();
    }
  }

  handle401() {
    this.clearAuthData();
    this.sessionExpired = true;
  }

  refreshToken = async () => {
    try {
      const response = await http.post('/refresh-token/');
      const { access, refresh } = response.data;
      const expirationTime = Date.now() + (5 * 60 * 1000);
      this.setAuthData(this.usuario.id ?? 0, this.usuario.username, access, expirationTime);
      localStorage.setItem('refreshToken', refresh);
    } catch (error) {
      console.error('Error refreshing token:', error);
      this.handle401();
    }
  }

  fetchUserId = async (identifier: string): Promise<number | null> => {
    try {
      const response = await http.get(`/users/?search=${identifier}`);
      console.log('Resultado da busca do usuário:', response.data.results);
      const user = response.data.results.find((u: IUser) => 
        u.username.toLowerCase() === identifier.toLowerCase() || 
        (u.email && u.email.toLowerCase() === identifier.toLowerCase())
      );
      console.log('Usuário encontrado:', user);
      return user ? user.id : null;
    } catch (error) {
      console.error('Error fetching user ID:', error);
      return null;
    }
  }
}

const autenticaStore = new AutenticaStore();

export default autenticaStore;
