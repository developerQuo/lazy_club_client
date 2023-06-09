import type { NextPage } from 'next';
import { useCallback } from 'react';
import { authToken, isLoggedInVar } from '../../apollo';
import Logo from '../../components/Logo';
import { useForm } from 'react-hook-form';
import { FormError } from '../../components/FormError';
import { gql, useMutation } from '@apollo/client';
import {
	LoginMutation,
	LoginMutationVariables,
} from '../../__generated__/LoginMutation';
import { Button } from '../../components/Button';
import Link from 'next/link';
import Seo from '../../components/Seo';
import { emailPattern } from '../../utils/patterns';
import { LOCALSTORAGE_TOKEN } from '../../utils/constants';
import { useRouter } from 'next/router';

const LOGIN_MUTATION = gql`
	mutation LoginMutation($input: LoginInput!) {
		login(input: $input) {
			ok
			token
			error
		}
	}
`;

interface IForm {
	email: string;
	password: string;
}

const SignIn: NextPage = () => {
	const { register, getValues, getFieldState, handleSubmit, formState } =
		useForm<IForm>({ mode: 'onBlur' });
	const router = useRouter();
	const onCompleted = (data: LoginMutation) => {
		const { ok, token } = data.login;
		if (ok && token) {
			localStorage.setItem(LOCALSTORAGE_TOKEN, token);
			authToken(token);
			isLoggedInVar(true);
			if (router.query.back) {
				router.back();
			} else {
				router.push('/');
			}
		}
	};
	const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
		LoginMutation,
		LoginMutationVariables
	>(LOGIN_MUTATION, {
		onCompleted,
	});
	const onSubmit = useCallback(() => {
		if (!loading) {
			const { email, password } = getValues();
			loginMutation({
				variables: {
					input: {
						email,
						password,
					},
				},
			});
		}
	}, [loginMutation, getValues]);
	return (
		<div className="page">
			<Seo title="Sign In" />
			<div className="hero min-h-screen">
				<div className="hero-content flex-col">
					<div className="text-center">
						<h2 className="text-xl">성공하는 사람들의 성장 습관</h2>
						<Logo width={300} height={50} />
						<h3 className="text-2xl font-bold">로그인</h3>
					</div>
					<form className="form space-y-4" onSubmit={handleSubmit(onSubmit)}>
						<input
							type="email"
							className="input input-bordered w-full"
							placeholder="Email"
							required
							{...register('email', {
								pattern: emailPattern,
							})}
						/>
						{getFieldState('email').error && (
							<FormError errorMessage={getFieldState('email').error?.message} />
						)}
						{getFieldState('email').error?.type === 'pattern' && (
							<FormError errorMessage={'올바른 이메일 형식을 입력하세요.'} />
						)}
						<input
							type="password"
							className="input input-bordered w-full"
							placeholder="비밀번호"
							required
							{...register('password')}
						/>
						{getFieldState('password').error && (
							<FormError
								errorMessage={getFieldState('password').error?.message}
							/>
						)}
						<Button
							canClick={formState.isValid}
							loading={loading}
							actionText="로그인"
						/>
						{loginMutationResult?.login.error && (
							<FormError errorMessage={loginMutationResult.login.error} />
						)}
					</form>
					<div>
						New to Lazy Club?{' '}
						<Link href="/sign-up">
							<span className="text-sky-500 cursor-pointer hover:underline">
								회원가입
							</span>
						</Link>
					</div>
					<div className="card flex-shrink-0">
						<div className="card-body">
							<a
								id="custom-login-btn"
								href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/kakao`}
								// href={`https://kauth.kakao.com/oauth/authorize?client_id=${
								// 	process.env.NEXT_PUBLIC_KAKAO_ID
								// }&redirect_uri=${'http://localhost:3000/auth/kakao'}&response_type=code`}
							>
								<img
									src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg"
									width="222"
									alt="카카오 로그인 버튼"
								/>
							</a>
							{/* <h4>네이버 계정으로 로그인</h4>
							<h4>Google 계정으로 로그인</h4> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignIn;
