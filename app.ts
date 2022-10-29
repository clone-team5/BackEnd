const express = require("express");
const app = express();
const {database} = require( "./src/index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from "express"
import {User} from './src/entity/User';

require('dotenv').config();

interface UserInterface {
  userId?: number,
  nickname: string,
  password: string,
  imgPath?: string,
  refreshToken?: string
}

app.use([
  express.json(),
  express.urlencoded({ extended: false }),
]);

app.post('/signup',async( req:Request, res:Response, next:NextFunction)=>{ 
  try {
    const {email, nickname, password,imgPath} = req.body;
    const user = new User();

    // 비밀번호 암호화
    const hashPassword:string = await bcrypt.hash(password,10);
    
    user.email = email ;
    user.nickname = nickname ;
    user.password = hashPassword ;
    user.imgPath = imgPath ;
    
    const result: UserInterface = await user.save(); // save 함수 자체가 느리다는 검색 결과가 있네요잉
    // = const update = await User.save({firstName:firstName, lastName:lastName,isActive: true })
  
    res.send({msg:'회원가입 완료!',data:result})
    
  } catch (error) {
    console.log(error)
    res.status(409).send({msg: '데이터 중복!'});
  }
});

app.post('/login',async( req:Request, res:Response, next:NextFunction)=>{ 
  try {
    const {email,password} = req.body;
    const user = new User();
  
    const findOneResult: UserInterface | null  = await User.findOne({where:{ email:email }});
    
    if(!findOneResult) throw new Error('No content');
    
    
    const passwordResult = await bcrypt.compare(password,findOneResult['password']);
    if(!passwordResult) throw new Error('No content');
    
    const accessToken: string = await jwt.sign(
      {
        userId: findOneResult['userId'],
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '3h',
      });
      
    const refreshToken: string = await jwt.sign(
      { },
      process.env.SECRET_KEY,
      {
        expiresIn: '7h',
      });

    // refreshToken 암호화 제거
    // const hashtoken:string = await bcrypt.hash(password,10);
    
    const updateUser = await User.update(
      {userId:findOneResult['userId']},
      { refreshToken: refreshToken}
    )
    
    if(!updateUser['affected']) throw new Error('refreshToken update error');

    res.send({msg:'로그인 완료!',accessToken:accessToken,refreshToken:refreshToken})
    
  } catch (error) {
    
    next(error)
    
  }
});

app.listen(3000, () => { 
  console.log("서버가 켜졌어요!");
});

