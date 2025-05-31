export default class Alert {
  constructor() {
    this.alerts = [];
    this.loadAlerts();
  }

  async loadAlerts() {
    try {
      const response = await fetch("/json/alerts.json");
      this.alerts = await response.json();
      this.createAlertSection();
    } catch (error) {
      error("Error loading alerts:", error);
    }
  }

  createAlertSection() {
    if (this.alerts.length > 0) {
      const alertSection = document.createElement("section");
      alertSection.classList.add("alert-list");

      this.alerts.forEach((alert) => {
        const alertMessage = document.createElement("p");
        alertMessage.textContent = alert.message;
        alertMessage.style.backgroundColor = alert.background;
        alertMessage.style.color = alert.color;
        alertSection.appendChild(alertMessage);

        // Set a timeout to remove the alert after 5 seconds
        setTimeout(() => {
          alertMessage.remove();
        }, 5000);
      });

      const mainElement = document.querySelector("main");
      mainElement.prepend(alertSection);
    }
  }
}