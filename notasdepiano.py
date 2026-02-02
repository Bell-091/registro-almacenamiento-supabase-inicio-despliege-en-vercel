import pyautogui
import time

# Define la secuencia de notas
notas = [
    'tf', 'ua', 'o', 'ua', 'o', 'ua', 'tf', 'ua', 'o', 'ua', 'o', 'ua',
    'ep', 'A', 'ua', 'T', 'uo', 'Tp', 'ed', 'TS', 'ud', 'Tf', 'uS', 'Tp',
    'qf', 'ep', 'tf', 'ep', 'tf', 'ep', 'qf', 'WO', 'tf', 'WO', 'tg', 'W',
    'tf', 'us', 'o', 'us', 'od', 'uf', 'rd', 'os', 'oa',
    # ... puedes continuar agregando el resto de las notas aquí
]

# Función para tocar cada nota
def tocar_nota(nota):
    for tecla in nota:
        pyautogui.press(tecla)
        time.sleep(0.05)  # Pequeña pausa entre teclas

# Pausa inicial para preparar
print("Preparándote para tocar en 3 segundos...")
time.sleep(3)

# Reproduce la secuencia
for nota in notas:
    if nota.strip():  # Ignora notas vacías
        tocar_nota(nota)
        time.sleep(0.1)  # Pausa entre notas

print("🎶 Secuencia completada.")