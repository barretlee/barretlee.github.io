<?php
	sleep(1);
	if(empty($_POST['user']) || $_POST['user'] != "barret") {
		$errno = 1;
		$msg = "用户名错误！";
		echo json_encode(Array("errno" =>$errno, "msg"=>$msg));
		exit(1);
	}

	if(empty($_POST['pwd']) || $_POST['pwd'] != "123"){
		$errno = 2;
		$msg = "密码错误！";
		echo json_encode(Array("errno"=>$errno, "msg"=>$msg));
		exit(1);
	}

	$errno = 0;
	$msg = "验证成功~";
	echo json_encode(Array("errno"=>$errno, "msg"=>$msg));
?>