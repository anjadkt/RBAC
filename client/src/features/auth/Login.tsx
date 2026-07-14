import { useState } from 'react'
import type { FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { loginSchema, type LoginFormErrors } from './validation';
import { Toast } from '../../utils/toast';
import { ButtonLoader } from '../../components/layout/Loading';

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth()
  const navigate = useNavigate();
  const location = useLocation();

  function validate(): boolean {

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {

      const errors: LoginFormErrors = {};

      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof LoginFormErrors;
        if (!errors[field]) errors[field] = issue.message;
      });

      setFieldErrors(errors);
      return false;
    }

    setFieldErrors({});
    return true;
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!validate()) return;

    try {
      setSubmitting(true);
      await api.post("/auth/login", { email, password });
      await login();

      const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/root';
      navigate(redirectTo, { replace: true });

      Toast.success("Login success");

    } catch (error: any) {
      Toast.error("Login failed!");
      if (error.response.status === 400) {
        setFieldErrors({ email: "Invalid email or password." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <section className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/60 border border-slate-100 transition-all duration-200">

        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please enter your login details to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@company.com"
              className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${fieldErrors.email
                ? 'border-red-400 focus:ring-red-500'
                : 'border-slate-200 focus:border-transparent focus:ring-blue-600'
                }`}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${fieldErrors.password
                ? 'border-red-400 focus:ring-red-500'
                : 'border-slate-200 focus:border-transparent focus:ring-blue-600'
                }`}
            />
            {fieldErrors.password && (
              <p className="mt-1.5 text-sm text-red-600">{fieldErrors.password}</p>
            )}
          </div>

          <ButtonLoader
            isLoading={submitting}
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Logging in...' : 'Login'}
          </ButtonLoader>
        </form>

      </section>
    </main>
  )
}

export default Login