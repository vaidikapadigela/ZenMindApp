// SimplifiedCalendarService.js
export class GoogleCalendarSimple {
  constructor() {
    this.calendarId = 'primary';
    this.initialized = false;
    this.accessToken = null;
  }

  async init(accessToken) {
    if (this.initialized && this.accessToken) return;

    // Store the access token from Google Sign-In
    if (accessToken) {
      this.accessToken = accessToken;
    }

    // Load the GAPI script
    await new Promise((resolve, reject) => {
      // Check if script already loaded
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    // Load the client library
    await new Promise((resolve, reject) => {
      window.gapi.load('client', {
        callback: resolve,
        onerror: reject,
      });
    });

    // Initialize the client
    try {
      await window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      });

      // Set the access token if we have one
      if (this.accessToken) {
        window.gapi.client.setToken({ access_token: this.accessToken });
      }

      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      throw error;
    }
  }

  // Set access token (called after Google Sign-In)
  setAccessToken(token) {
    this.accessToken = token;
    if (window.gapi?.client) {
      window.gapi.client.setToken({ access_token: token });
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.initialized && this.accessToken;
  }

  async addTodo(todo) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Calendar');
    }

    await this.init();
    
    const event = {
      summary: todo.title,
      description: todo.description || '',
      start: {
        dateTime: new Date(todo.dueDate).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(new Date(todo.dueDate).getTime() + 30 * 60000).toISOString(), // Default 30 min duration
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 30 } // 30 minutes before
        ]
      }
    };

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: this.calendarId,
        resource: event
      });
      
      return {
        id: response.result.id,
        link: response.result.htmlLink
      };
    } catch (error) {
      console.error('Failed to add todo to calendar:', error);
      throw error;
    }
  }

  async updateTodo(todoId, updates) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Calendar');
    }

    await this.init();

    const event = {
      summary: updates.title,
      description: updates.description || '',
      start: {
        dateTime: new Date(updates.dueDate).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      end: {
        dateTime: new Date(new Date(updates.dueDate).getTime() + 30 * 60000).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    try {
      const response = await window.gapi.client.calendar.events.patch({
        calendarId: this.calendarId,
        eventId: todoId,
        resource: event
      });
      return response.result;
    } catch (error) {
      console.error('Failed to update todo in calendar:', error);
      throw error;
    }
  }

  async deleteTodo(todoId) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Calendar');
    }

    await this.init();
    
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: this.calendarId,
        eventId: todoId
      });
    } catch (error) {
      console.error('Failed to delete todo from calendar:', error);
      throw error;
    }
  }

  async getTodos(startDate, endDate) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated with Google Calendar');
    }

    await this.init();
    
    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items.map(event => ({
        id: event.id,
        title: event.summary,
        description: event.description || '',
        dueDate: new Date(event.start.dateTime || event.start.date),
        link: event.htmlLink
      }));
    } catch (error) {
      console.error('Failed to fetch todos from calendar:', error);
      throw error;
    }
  }

  // Clear authentication
  logout() {
    this.accessToken = null;
    this.initialized = false;
    if (window.gapi?.client) {
      window.gapi.client.setToken(null);
    }
  }
}

export const calendarService = new GoogleCalendarSimple();