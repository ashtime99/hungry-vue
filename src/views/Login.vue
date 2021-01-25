<template>
	<div>
		<el-form :rules="rules" ref="loginForm" :model="loginForm" class="loginContainer">
			<h3 class="loginTitle">hungry后台系统登录</h3>
			<el-form-item prop="username">
				<el-input type="text" v-model="loginForm.username" placeholder="请输入用户名" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="loginForm.password" placeholder="请输入密码" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item prop="code">
				<el-input type="text" v-model="loginForm.code" placeholder="点击图片更换验证码" auto-complete="off" style="width: 250px;margin-right: 25px;"></el-input>
				<img :src="captchurl" />
			</el-form-item>
			<el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
			<el-button type="primary" class="loginBtn" @click="submitLogin">登录</el-button>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				checked: true,
				captchurl: '',
				loginForm: {
					username: 'admin',
					password: '123',
					code: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}],
					code: [{
						required: true,
						message: '请输入验证码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitLogin() {
				this.$refs.loginForm.validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						this.$message.error('请输入正确的字段！');
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped>
	.loginContainer {
		border-radius: 15px;
		background-clip: padding-box;
		margin: 180px auto;
		width: 350px;
		padding: 15px 35px 15px 35px;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #caca6c;
	}

	.loginTitle {
		margin: 0px auto 15px auto;
		text-align: center;
	}

	.loginBtn {
		width: 100%;
	}

	.loginRemember {
		text-align: left;
		margin-bottom: 15px;
	}
</style>
