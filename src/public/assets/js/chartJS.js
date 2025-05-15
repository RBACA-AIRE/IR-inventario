const ctx1 = document.getElementById("chart-1").getContext("2d");
const mychart1 = new Chart(ctx1, {
  type: "polarArea",
  data: {
    labels: ["Kyndryl", "Morelli", "GCP"],
    datasets: [
      {
        label: "N° de Servidores",
        data: [600, 800, 1000],
        backgroundColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
      },
    ],
  },
  Options: {
    responsive: true,
  }
});

const ctx2 = document.getElementById("chart-2").getContext("2d");
const mychart2 = new Chart(ctx2, {
  type: "bar",
  data: {
    labels: ["Kyndryl", "Morelli", "GCP"],
    datasets: [
      {
        label: "N° de Sistemas O.",
        data: [100, 400, 500],
        backgroundColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
      },
    ],
  },
  Options: {
    responsive: true,
  }
});

const ctx3 = document.getElementById("chart-3").getContext("2d");
const mychart3 = new Chart(ctx3, {
  type: "line",
  data: {
    labels: ["Kyndryl", "Morelli", "GCP"],
    datasets: [
      {
        label: "N° de Usuarios",
        data: [100, 400, 500],
        backgroundColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
      },
    ],
  },
  Options: {
    responsive: true,
  }
});

const ctx4 = document.getElementById("chart-4").getContext("2d");
const mychart4 = new Chart(ctx4, {
  type: "doughnut",
  data: {
    labels: ["Kyndryl", "Morelli", "GCP"],
    datasets: [
      {
        label: "N° de Accesos Remotos",
        data: [100, 400, 500],
        backgroundColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
      },
    ],
  },
  Options: {
    responsive: true,
  }
});