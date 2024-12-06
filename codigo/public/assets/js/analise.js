//Selecionar o item que for clicado

var menuItem = document.querySelectorAll('.item-menu')

function selectLink(){
    menuItem .forEach((item) =>
        item.classList.remove('ativo')
)
this.classList.add('ativo')
}

//Espandir o menu

menuItem.forEach((item) =>
    item.addEventListener('click', selectLink)
)

var btnExp = document.querySelector('#btn-exp')
var menuSide = document.querySelector('.menu-lateral')

btnExp.addEventListener('click', function(){
    menuSide.classList.toggle('expandir')
})

// Gráfico geral
fetch('db.json')
    .then(response => response.json())
    .then(parsedData => {
        const porcentagensRealizadas = parsedData.graficoGeral.habitosRealizadosGeral.map(habito => (habito / parsedData.graficoGeral.habitosTotais) * 100);

        const ctx = document.getElementById('lineChart').getContext('2d');
        const lineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: parsedData.graficoGeral.dias,
                datasets: [{
                    label: 'Porcentagem de Hábitos Realizados',
                    data: porcentagensRealizadas,
                    fill: false,
                    borderColor: 'rgba(25, 196, 99, 1)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 100,
                        title: {
                            display: true,
                            text: 'Porcentagem (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Dias da Semana'
                        }
                    }
                }
            }
        });
    });

// Gráfico específico
document.addEventListener("DOMContentLoaded", () => {
    const habitsContainer = document.getElementById("habitsContainer");

    fetch('db.json')
        .then(response => response.json())
        .then(data => {
            const habits = data.graficoExpecifico;
            habits.forEach((habit, index) => {
                createHabitCard(habit, index);
            });
        })
        .catch(error => {
            console.error("Erro ao carregar os hábitos:", error);
        });

    function createHabitCard(habit, index) {
        const habitCard = document.createElement('div');
        habitCard.classList.add('custom-habit-card');
        habitCard.innerHTML = `
            <h3>${habit.nomeHábito}</h3>
            <p>Frequência: ${habit.frequencia} vezes por semana</p>
        `;

        const chartContainer = document.createElement('div');
        chartContainer.classList.add('custom-chart-container');
        chartContainer.style.display = 'none';
        chartContainer.innerHTML = `<canvas id="customLineChart-${index}"></canvas>`;

        habitCard.addEventListener('click', () => {
            if (chartContainer.style.display === 'none') {
                chartContainer.style.display = 'block';
                loadCustomChart(habit, index);
            } else {
                chartContainer.style.display = 'none';
            }
        });

        habitsContainer.appendChild(habitCard);
        habitsContainer.appendChild(chartContainer);
    }

    function loadCustomChart(habit, index) {
        const porcentagensRealizadas = habit.habitosRealizados.map(h => h * 100);

        const ctx = document.getElementById(`customLineChart-${index}`).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: habit.dias,
                datasets: [{
                    label: 'Hábito Realizado (%)',
                    data: porcentagensRealizadas,
                    fill: false,
                    borderColor: 'rgba(25, 196, 99, 1)',
                    tension: 0.1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: 100,
                        title: {
                            display: true,
                            text: 'Porcentagem (%)',
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Dias da Semana',
                        }
                    }
                }
            }
        });
    }
});
