import { LoginAutomation } from './login';

// Mock de las variables de entorno con credenciales incorrectas
process.env.USER = '12347';
process.env.PASSWORD = 'Contrasella incorecta.jpg';

describe('LoginAutomation', () => {
    let loginAutomation: LoginAutomation;
    
    beforeEach(() => {
        loginAutomation = new LoginAutomation();
    });

    afterEach(async () => {
        // Cerramos el navegador después de cada test
        await loginAutomation.closeBrowser();
    });

    describe('Prueba de inicio de sesión fallido', () => {
        it('debería fallar el inicio de sesión con credenciales incorrectas', async () => {
            // Iniciar el navegador y navegar a la página
            await loginAutomation.launchBrowser();
            await loginAutomation.navigateToLoginPage(
                'https://sistemacuenca.ucp.edu.ar/alumnosnotas/Default.aspx?ReturnUrl=%2falumnosnotas%2fProteccion%2fInscripcionesExamenes.aspx%3fSel%3d2&Sel=2'
            );

            // Intentar iniciar sesión con credenciales incorrectas
            await loginAutomation.performLogin();

            // Validar que el inicio de sesión falló
            await loginAutomation.validateLoginFailure();

            // Esperar unos segundos para ver el resultado (opcional)
            await new Promise(resolve => setTimeout(resolve, 3000));
        }, 30000); // Aumentamos el timeout a 30 segundos para dar tiempo suficiente
    });
});