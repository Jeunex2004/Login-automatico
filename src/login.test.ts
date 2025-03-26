import { channel } from 'diagnostics_channel';
import { LoginAutomation } from './login';
import { chromium } from 'playwright';

// Mock de las variables de entorno
process.env.USER;
process.env.PASSWORD;

// Mock de playwright
jest.mock('playwright', () => ({
    chromium: {
        launch: jest.fn().mockResolvedValue({
            newContext: jest.fn().mockResolvedValue({
                newPage: jest.fn().mockResolvedValue({
                    goto: jest.fn().mockResolvedValue(null),
                    fill: jest.fn().mockResolvedValue(null),
                    click: jest.fn().mockResolvedValue(null),
                    waitForSelector: jest.fn().mockResolvedValue({
                        textContent: jest.fn().mockResolvedValue('Evin Linder, Jeuel Elias Natanael - Ingeniería en Sistemas de Información')
                    })
                })
            }),
            close: jest.fn().mockResolvedValue(null)
        })
    }
}));

describe('LoginAutomation', () => {
    let loginAutomation: LoginAutomation;

    beforeEach(() => {
        loginAutomation = new LoginAutomation();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('debe inicializar correctamente con las credenciales', () => {
        expect(loginAutomation).toBeDefined();
    });

    test('debe lanzar el navegador correctamente', async () => {
        await loginAutomation.launchBrowser();
        expect(chromium.launch).toHaveBeenCalledWith({
            headless: false,
            channel: 'chrome',
        });
    });

    test('debe navegar a la página de inicio de sesión', async () => {
        await loginAutomation.launchBrowser();
        const url = 'https://sistemacuenca.ucp.edu.ar/alumnosnotas/Default.aspx?ReturnUrl=%2falumnosnotas%2fProteccion%2fInscripcionesExamenes.aspx%3fSel%3d2&Sel=2';
        await loginAutomation.navigateToLoginPage(url);
        // Verificar que se llamó a goto con la URL correcta
        expect(loginAutomation['page']?.goto).toHaveBeenCalledWith(url);
    });

    test('debe realizar el login correctamente', async () => {
        await loginAutomation.launchBrowser();
        await loginAutomation.performLogin();
        
        // Verificar que se llamaron los métodos fill con los valores correctos
        expect(loginAutomation['page']?.fill).toHaveBeenCalledWith(
            'input[name="ctl00$ContentPlaceHolder1$TextBox1"]',
            '45776828'
        );
        expect(loginAutomation['page']?.fill).toHaveBeenCalledWith(
            'input[name="ctl00$ContentPlaceHolder1$Clave"]',
            'Blender69'
        );
    });

    test('debe validar el login exitoso', async () => {
        await loginAutomation.launchBrowser();
        await expect(loginAutomation.validateLoginSuccess()).resolves.not.toThrow();
    });
}); 