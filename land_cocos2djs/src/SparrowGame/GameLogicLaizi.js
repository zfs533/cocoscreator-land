/*
 * created By zhoufangsheng 20151104
 */

var laiziNum = 0;
function setLaiziNumber(num)
{
	laiziNum = num;
	sparrowDirector.gameData.laiziValue = gameLogic.getPukerData([laiziNum])[0];
}

var CGameLogicLizi = cc.Class.extend(
		{
			m_cbCardListData:
				[
				 0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,	//方块 A - K
				 0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x1A,0x1B,0x1C,0x1D,	//梅花 A - K
				 0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,0x2B,0x2C,0x2D,	//红桃 A - K
				 0x31,0x32,0x33,0x34,0x35,0x36,0x37,0x38,0x39,0x3A,0x3B,0x3C,0x3D,	//黑桃 A - K
				 0x4E,0x4F //双鬼
				 ],
				 /*
				  * 判断牌的类型
				  * @param data 用户选择的卡牌
				  * @return {number}
				  */
				 getType:function(data)
				 {
					 if ( !data || data.length < 1 ){return;}

					 var temp = this.getPukerData(data);//{value:1-13,sValue:1-53}
//					 var temp = data.sort(function(a,b){return a.value-b.value;});//{value:1-13,sValue:1-53}
					 switch ( temp.length )
					 {
					 case 1:
					 {
						 return CT_SINGLE;//单张
					 }

					 case 2:
					 {
						 cc.log("temp[0].sValue= "+temp[0].sValue+"  temp[1].sValue= "+temp[1].sValue);
						 if ( this.isSamecard(temp) )
						 {
							 return CT_DOUBLE;//对子
						 }
						 else if( temp[0].sValue == 52 && temp[1].sValue == 53 )
						 {
							 cc.log("temp[0].sValue= "+temp[0].sValue+"  temp[1].sValue= "+temp[1].sValue+"  ---"+CT_MISSILE_CARD);

							 return CT_MISSILE_CARD;//王炸
						 }
						 else if ( temp[0].sValue == 53 && temp[1].sValue == 52 )
						 {
							 cc.log("temp[0].sValue= "+temp[0].sValue+"  temp[1].sValue= "+temp[1].sValue);

							 return CT_MISSILE_CARD;//王炸
						 }
						 return CT_ERROR;
					 }

					 case 3:
					 {
						 if ( this.isSamecard(temp) )
						 {
							 return CT_THREE;//三不带
						 }
						 return CT_ERROR;
					 }

					 case 4:
					 {
						 if ( this.isSamecard(temp) )
						 {
							 return CT_BOME_CARD;//炸弹
						 }
						 else if ( this.isThreeByOther(temp) )
						 {
							 return CT_THREE_TAKE_ONE;//三带一单
						 }
						 return CT_ERROR;
					 }

					 case 5:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return  CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isThreeByOther(temp) )
						 {
							 return CT_THREE_TAKE_TWO;//三带二
						 }
						 return CT_ERROR;
					 }

					 case 6:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return  CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isFourByOther(temp) )
						 {
							 return CT_FOUR_TAKE_ONE;//四带两单
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 7:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 return CT_ERROR;
					 }

					 case 8:
					 {
						 if ( this.isStraight(temp ))
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if (this.isFourByOther(temp))
						 {
							 return CT_FOUR_TAKE_TWO;//四带两对
						 }
						 else if ( this.isDoubleByDouble(temp))
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 9:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 10:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//顺子
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 11:
					 {
						 if ( this.isStraight(temp ) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 12:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }

						 return CT_ERROR;
					 }

					 case 13:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 return CT_ERROR;
					 }

					 case 14:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 return CT_ERROR;
					 }

					 case 15:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 16:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_SINGLE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 17:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 return CT_ERROR;
					 }

					 case 18:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 case 19:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 return CT_ERROR;
					 }

					 case 20:
					 {
						 if ( this.isStraight(temp) )
						 {
							 return CT_SINGLE_LINE;//顺子
						 }
						 else if ( this.isDoubleByDouble(temp) )
						 {
							 return CT_DOUBLE_LINE;//连对
						 }
						 else if ( this.isThreeByThree(temp) )
						 {
							 return CT_THREE_LINE;//飞机
						 }
						 return CT_ERROR;
					 }

					 default :
						 return CT_ERROR;
					 }
					 return CT_ERROR;
				 },
			/**
			 * 获取当前类型可出牌
			 * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
			 * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
			 * @param bool 是否塞选任意类型扑克
			 * @param type 牌的类型
			 * @returns {array}
			 */
			getCardForType:function(data, s_data, type, bool)
			{
					if ( bool)
					{
						data = data.sort(function(a,b){return a.value-b.value;});//{value:1-13,sValue:1-53}
						s_data = s_data.sort(function(a,b){return a.value-b.value;});//{value:1-13,sValue:1-53}
					}
					else
					{
						data = this.getPukerData(data);//{value:1-13,sValue:1-53}
						s_data = this.getPukerData(s_data);//{value:1-13,sValue:1-53}
					}
					 cc.log("data = "+JSON.stringify(data));
					 cc.log("s_data = "+JSON.stringify(s_data));
					 switch (type) 
					 {
					 case CT_SINGLE://单牌
					 {
						 var resultData = this.getSingleCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_DOUBLE://对牌类型
					 {
						 var resultData = this.getDoubleCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_THREE://三不带类型
					 {
						 var resultData = this.getThreeCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_THREE_TAKE_ONE://三带一类型
					 {
						 var resultData = this.getThreeByOneCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_THREE_TAKE_TWO://三带一对类型
					 {
						 var resultData = this.getThreeByTwoCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_FOUR_TAKE_ONE://四带两单类型//TODO
					 {
						 var resultData = this.getFourByOneCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_FOUR_TAKE_TWO://四带两对类型
					 {
						 var resultData = this.getFourByTwoCard(data, s_data, true);
						 return resultData;
					 }
					 case CT_SINGLE_LINE://顺子类型
					 {
						 var resultData = this.getStright(data, s_data, true);
						 return resultData;
					 }
					 case CT_DOUBLE_LINE://连对类型
					 {
						 var resultData = this.getDoubleByDouble(data, s_data, true);
						 return resultData;
					 }
					 case CT_THREE_LINE://飞机类型
					 {
						 var resultData = this.getThreeByThree(data, s_data, true);
						 return resultData;
					 }
					 case CT_BOME_CARD://炸弹类型
					 {
						 var resultData = this.getFourCard(data, s_data, true, CT_BOME_CARD);
						 return resultData;
					 }
//					 case CT_MISSILE_CARD://火箭类型
//					 {
	//					 var resultData = this.getMissile(data, s_data, true);
	//					 return resultData;
//					 }
					 default:
						 break;
					 }
					 return CT_ERROR; 
				 },
				 /**
				  * 获取炸弹
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getFourCard:function(data, s_data, is_add_king, type)
				 {
					 if ( type )
					 {
						 var lcount = 0;//判断上家出得炸弹是否为癞子炸弹
						 var tempSData = this.getPukerData(sparrowDirector.gameData.oTherPuker01);
						 for ( var i = 0; i < tempSData.length; i++ )
						 {
							 if ( tempSData[i].value == sparrowDirector.gameData.laiziValue.value )
							 {
								 lcount++;
							 }
						 }
						 var dd = this.getBoom(data, s_data, is_add_king);
						 if ( lcount > 0 )
						 {
							 var s_d = [
								 {value:0,sValue:0},
								 {value:0,sValue:0},
								 {value:0,sValue:0},
								 {value:0,sValue:0}
							 ];
							 dd = this.getBoom(data, s_d, is_add_king);
							 var laiziBoom = this.getLaiZiBoom(data, s_data);
							 dd = this.arrayConcatArray(dd, laiziBoom);
						 }
					 }
					 else
					 {
						 var dd = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data, s_data);
						 dd = this.arrayConcatArray(dd, laiziBoom);
					 }
					 return dd;
				 },
				 /**
				  * 获取飞机
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getThreeByThree:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var laizi = this.getLaiziNumber(data);
					 var newGroupData = [];
					 var testData = [{"value":-3,"sValue":5},{"value":-3,"sValue":5},{"value":-3,"sValue":5}];
					 //获取对方三带的牌`
					 var o_three = this.getThreeCard(s_data, testData, false);
					 var temp = [];
					 var item = [];
					 //1 飞机带单牌， 2 飞机带对子， 3 飞机不带牌
					 var type = 1;
					 for ( var i = 0; i < o_three.length; i++ )
					 {
						 item = o_three[i];
						 if ( item.length  == 3 )
						 {
							 temp.push(item);
						 }
					 }
					 o_three = temp.sort(function(a,b){return a[0].value - b[0].value;});
					 var my_three = this.getThreeCard(data, o_three[0], false);
					 //癞子三张
					 var laizi_three = this.getLaiZiThree(data, o_three[0]);
					 for ( var i = 0; i < laizi_three.length; i++ )
					 {
						 cc.log("laizithree= "+JSON.stringify(laizi_three[i]));
					 }
					 this.arrayConcatArray(my_three, laizi_three);
					 temp = [];
					 for ( var j = 0; j < my_three.length; j++ )
					 {
						 item = my_three[j];
						 if ( item.length == 3 )
						 {
							 temp.push(item);
						 }
					 }
					 my_three = temp.sort(function(a,b){return a[0].value - b[0].value;});
					 var o_three_length = o_three.length;
					 var o_all_length   = s_data.length;
					 //当3带牌的长度等于用户出牌的总长度的1/2时，为带单牌
					 if ( o_three_length*3 + o_three_length == o_all_length )
					 {
						 type = 1;//飞机带单牌
						 cc.log("飞机带单牌");
					 }
					 else if ( o_three_length*3 == o_all_length )
					 {
						 type = 3;//飞机不带牌
						 cc.log("飞机不带牌");
					 }
					 else
					 {
						 type = 2;//飞机带对子
						 cc.log("飞机带对子");
					 }
					 cc.log("飞机类型type= "+type);
					 cc.log(JSON.stringify(my_three));
					 var tempArr = [];
					 for ( var i = 0; i < my_three.length; i++ )
					 {
						 item = my_three[i];
						 if ( tempArr.length < 1 )
						 {
							 tempArr.push(item);
							 continue;
						 }
//						 if ( this.isStraight([my_three[i-1][0], my_three[i][0]] ) )
						 if ( my_three[i-1][0] != my_three[i][0] )
//						 if ( Math.abs(my_three[i-1][0].value - my_three[i][0].value) == 1 )
						 {
							 tempArr.push(item);
						 }
					 }
					 var length = o_three.length;
					 for ( var k = 0; k < tempArr.length; k++ )
					 {
						 var n_item = [];
						 var temp   = [];
						 var isP    = true;
						 if ( k + length <= tempArr.length )
						 {
							 for ( var j = k; j < k+length; j++ )
							 {
								 var tempItem = DataUtil.copyJson(tempArr[j]);
								 if ( n_item.length < 1 )
								 {
									 n_item = tempItem;
								 }
								 else
								 {
									 Array.prototype.push.apply(n_item, tempItem);
								 }
								 temp.push(tempArr[j][0]);
							 }
							 cc.log("temp === "+JSON.stringify(temp));
							 for ( var p = 1; p < temp.length; p++ )
							 {
								 var id1 = temp[p].value;
								 var id2 = temp[p-1].value;
								 if ( Math.abs(id1 - id2 ) != 1 )
								 {
									 isP = false;
									 break;
								 }
							 }
							 if ( isP )
							 {
								 newGroupData.push(n_item);
							 }
						 }
					 }
					 temp = [];
					 isP = true;
					 var group = [];
					 var reGroup = [];
					 cc.log("type= "+type);
					 if ( type == 1 )//飞机带单牌
					 {
						 temp = data;
						 for ( var i = 0; i < my_three.length; i++ )
						 {
							 //得到单牌,单牌不能包含三带牌
							 var temp_count = 0;
							 if ( laizi.count > 0 )
							 {
								 for ( var j = 0; j < my_three[i].length; j++ )
								 {
									 if ( my_three[i][j].value == laizi.laizi.value )
									 {
										 temp_count++;
									 }
								 }
							 }
							 cc.log("temp_count= "+temp_count);
							 if ( temp_count > 0 ){continue;}
							 temp = this.removeCard(temp, my_three[i][0]);
						 }
						 if ( laizi.count > 0 )
						 {
							 temp = this.removeCard(temp, laizi.laizi);
						 }
						 //TODO
						 if ( my_three.length >= o_three.length && temp.length >= o_three.length )
						 {
							 if ( o_three.length == 2 )
							 {
								 for ( var i = 1; i < my_three.length; i++ )
								 {
									 var mm = my_three[i-1];
									 var nn = my_three[i];
									 mm = this.arrayConcatArray(mm, nn);
									 group.push(mm);
								 }
							 }
							 else if ( o_three.length == 3 )
							 {
								 for ( var i = 2; i < my_three.length; i++ )
								 {
									 var mm = my_three[i-2];
									 var nn = my_three[i-1];
									 var oo = my_three[i];
									 mm = this.arrayConcatArray(mm, nn, oo);
									 group.push(mm);
								 }
							 }
							 else if ( o_three.length == 4 )
							 {
								 for ( var i = 3; i < my_three.length; i++ )
								 {
									 var mm = my_three[i-3];
									 var nn = my_three[i-2];
									 var oo = my_three[i-1];
									 var pp = my_three[i];
									 mm = this.arrayConcatArray(mm, nn, oo, pp);
									 group.push(mm);
								 }
							 }
							 else if ( o_three.length == 5 )
							 {
								 for ( var i = 4; i < my_three.length; i++ )
								 {
									 var mm = my_three[i-4];
									 var nn = my_three[i-3];
									 var oo = my_three[i-2];
									 var pp = my_three[i-1];
									 var qq = my_three[i];
									 mm = this.arrayConcatArray(mm, nn, oo, pp, qq);
									 group.push(mm);
								 }
							 }
							 if ( group && group.length > 0 )
							 {
								 for ( var i = 0; i < group.length; i++ )
								 {
									 if ( o_three.length == 2 )
									 {
										 for ( var j = 1; j < temp.length; j++ )
										 {
											 var mm = temp[j-1];
											 var nn = temp[j];
											 var aa = DataUtil.copyJson(group[i]);
											 mm = this.arrayConcatArray(aa, mm, nn);
											 reGroup.push(mm);
										 }
									 }
									 else if ( o_three.length == 3 )
									 {
										 for ( var j = 2; j < temp.length; j++ )
										 {
											 var mm = temp[j-2];
											 var nn = temp[j-1];
											 var oo = temp[j];
											 var aa = DataUtil.copyJson(group[i]);
											 mm = this.arrayConcatArray(aa, mm, nn,oo);
											 reGroup.push(mm);
										 }
									 }
									 else if ( o_three.length == 4 )
									 {
										 for ( var j = 3; j < temp.length; j++ )
										 {
											 var mm = temp[j-3];
											 var nn = temp[j-2];
											 var oo = temp[j-1];
											 var pp = temp[j];
											 var aa = DataUtil.copyJson(group[i]);
											 mm = this.arrayConcatArray(aa, mm, nn, oo, pp);
											 reGroup.push(mm);
										 }
									 }
									 else if ( o_three.length == 5 )
									 {
										 for ( var j = 4; j < temp.length; j++ )
										 {
											 var mm = temp[j-4];
											 var nn = temp[j-3];
											 var oo = temp[j-2];
											 var pp = temp[j-1];
											 var qq = temp[j];
											 var aa = DataUtil.copyJson(group[i]);
											 mm = this.arrayConcatArray(aa, mm, nn, oo, pp, qq);
											 reGroup.push(mm);
										 }
									 }
								 }
							 }
						 }
						 group = reGroup;
						 cc.log("group.elngth==  "+group.length);
						 //将癞子牌用多了的组去掉
						 if ( laizi.count > 0 )
						 {
							 (function()
							 {
								 for ( var i = 0; i < group.length; i++ )
								 {
									 var item = group[i];
									 var cou = 0;
									 for ( var j = 0; j < item.length; j++ )
									 {
										 if ( item[j].value == laizi.laizi.value )
										 {
											 cou++;
										 }
									 }
									 if ( cou > laizi.count )
									 {
										 group.splice(i, 1);
										 arguments.callee();
									 }
								 }
							 })();
						 }
						 cc.log("group.elngth==  "+group.length);
						 //将三带牌和被带牌相同的去掉
						 (function()
						 {
							 for ( var i = 0; i < group.length; i++ )
							 {
								 var item = group[i];
								 var len = item.length;
								 var item_a = [item[len-1], item[len-2]];
								 if ( Math.abs(item[0].value - item[3].value) != 1 || item[0].value == 15 || item[3].value == 15 )
								 {
									 group.splice(i, 1);
									 arguments.callee();
								 }
								 else
								 {
									 for ( var j = 0; j < len-2; j++ )
									 {
										 for ( var k = 0; k < item_a.length; k++ )
										 {
											 if ( item[j].value == item_a[k].value )
											 {
												 group.splice(i, 1);
												 arguments.callee();
											 }
										 }
									 }
								 }
							 }
						 })();
						 cc.log("group.elngth==  "+group.length);
					 }
					 else if ( type == 2 )//飞机带对牌
					 {
						 var groupData = this.groupData(data);
						 group = [];
						 temp  = [];
						 var array = [];
						 //获取对牌
						 for ( var t = 0; t < groupData.length; t++ )
						 {
							 item = [];
							 if ( groupData[t].length == 2 )
							 {
								 temp.push(groupData[t]);
							 }
							 else if ( groupData[t].length > 2 )
							 {
								 item.push(groupData[t][0]);
								 item.push(groupData[t][1]);
								 temp.push(item);
							 }
						 }
						 //癞子对子
						 var laizi_double = this.getLaiZiDouble(data);
						 this.arrayConcatArray(temp, laizi_double);
						 if ( temp.length < o_three.length ){return [];}
						 var pItem = [];
						 for (var c = 0; c < newGroupData.length; c++ )
						 {
							 item = newGroupData[c];
							 pItem = [];
							 array = [];
							 for ( var b = 0; b < temp.length; b++ )
							 {
								 isP = true;
								 var tId = temp[b][0].value;
								 pItem = temp[b];
								 for ( var j = 0; j < item.length; j++ )
								 {
									 var pId = item[j].value;
									 if ( tId == pId )
									 {
										 isP = false;
										 break;
									 }
								 }
								 if ( isP )
								 {
									 array.push(pItem);
								 }
							 }
							 if ( array.length >= o_three.length )
							 {
								 if ( o_three.length == 2 )
								 {
									 for ( var u = 1; u < array.length; u++ )
									 {
										 var dd = DataUtil.copyJson(newGroupData[c]);
										 var mm = array[u-1];
										 var nn = array[u];
										 mm = this.arrayConcatArray(dd, mm, nn);
										 group.push(mm);
									 }
								 }
								 else if ( o_three.length == 3 )
								 {
									 for ( var u = 2; u < array.length; u++ )
									 {
										 var dd = DataUtil.copyJson(newGroupData[c]);
										 var mm = array[u-2];
										 var nn = array[u-1];
										 var oo = array[u];
										 mm = this.arrayConcatArray(dd, mm, nn, oo);
										 group.push(mm);
									 }
								 }
								 else if ( o_three.length == 4 )
								 {
									 for ( var u = 3; u < array.length; u++ )
									 {
										 var dd = DataUtil.copyJson(newGroupData[c]);
										 var mm = array[u-3];
										 var nn = array[u-2];
										 var oo = array[u-1];
										 var pp = array[u];
										 mm = this.arrayConcatArray(dd, mm, nn, oo, pp);
										 group.push(mm);
									 }
								 }
							 }
						 }
						 cc.log("group.elngth==  "+group.length);
						 //将癞子牌用多了的组去掉
						 if ( laizi.count > 0 )
						 {
							 (function()
							 {
								 for ( var i = 0; i < group.length; i++ )
								 {
									 var item = group[i];
									 var cou = 0;
									 for ( var j = 0; j < item.length; j++ )
									 {
										 if ( item[j].value == laizi.laizi.value )
										 {
											 cou++;
										 }
									 }
									 if ( cou > laizi.count )
									 {
										 group.splice(i, 1);
										 arguments.callee();
									 }
								 }
							 })();
						 }
						 cc.log("group.elngth==  "+group.length);
						 (function()
						 {
							 for ( var i = 0; i < group.length; i++ )
							 {
								 var item = group[i];
								 var len = item.length;
								 var item_a = [item[len-1], item[len-2]];
								 if ( Math.abs(item[0].value - item[3].value) != 1 || item[0].value == 15 || item[3].value == 15 )
								 {
									 group.splice(i, 1);
									 arguments.callee();
								 }
							 }
						 })();
						 cc.log("group.elngth==  "+group.length);
					 }
					 else//飞机不带
					 {
						 if ( my_three.length >= o_three.length )
						 {
							 if ( o_three.length == 2 )
							 {
								 for ( var u = 1; u < my_three.length; u++ )
								 {
									 var mm = my_three[u-1];
									 var nn = my_three[u];
									 var value = Math.abs(mm[0].value - nn[0].value);
									 mm = this.arrayConcatArray(mm, nn);
									 if ( value == 1 )
									 {
										 group.push(mm);
									 }
								 }
							 }
							 else if ( o_three.length == 3 )
							 {
								 for ( var u = 2; u < my_three.length; u++ )
								 {
									 var mm = my_three[u-2];
									 var nn = my_three[u-1];
									 var oo = my_three[u];
									 mm = this.arrayConcatArray(mm, nn, oo);
									 group.push(mm);
								 }
							 }
							 else if ( o_three.length == 4 )
							 {
								 for ( var u = 3; u < my_three.length; u++ )
								 {
									 var mm = my_three[u-3];
									 var nn = my_three[u-2];
									 var oo = my_three[u-1];
									 var pp = my_three[u];
									 mm = this.arrayConcatArray(mm, nn, oo, pp);
									 group.push(mm);
								 }
							 }
							 else if ( o_three.length == 5 )
							 {
								 for ( var u = 4; u < my_three.length; u++ )
								 {
									 var mm = my_three[u-4];
									 var nn = my_three[u-3];
									 var oo = my_three[u-2];
									 var pp = my_three[u-1];
									 var qq = my_three[u];
									 mm = this.arrayConcatArray(mm, nn, oo, pp, qq);
									 group.push(mm);
								 }
							 }
						 }
						 cc.log("group.elngth==  "+group.length);
						 //将癞子牌用多了的组去掉
						 if ( laizi.count > 0 )
						 {
							 (function()
							 {
								 for ( var i = 0; i < group.length; i++ )
								 {
									 var item = group[i];
									 var cou = 0;
									 for ( var j = 0; j < item.length; j++ )
									 {
										 if ( item[j].value == laizi.laizi.value )
										 {
											 cou++;
										 }
									 }
									 if ( cou > laizi.count )
									 {
										 group.splice(i, 1);
										 arguments.callee();
									 }
								 }
							 })();
						 }
						 cc.log("group.elngth==  "+group.length);
						 (function()
						 {
							 for ( var i = 0; i < group.length; i++ )
							 {
								 var item = group[i];
								 var len = item.length;
								 var item_a = [item[len-1], item[len-2]];
								 if ( Math.abs(item[0].value - item[3].value) != 1 || item[0].value == 15 || item[3].value == 15 )
								 {
									 group.splice(i, 1);
									 arguments.callee();
								 }
							 }
						 })();
						 cc.log("group.elngth==  "+group.length);
					 }
					 var resultGroup = [];

					 if ( is_add_king )
					 {
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(group, boom);
						 }
						 group = this.arrayConcatArray(group, laiziBoom);
					 }
					 return group;
				 },
				 /**
				  * 获取连对
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getDoubleByDouble:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 var laizi = this.getLaiziNumber(data);
					 var my_double = this.getDoubleCard(data, s_data, false);
					 //癞子对牌
					 var laizi_double = this.getLaiZiDouble(data, s_data);
					 my_double = this.arrayConcatArray(my_double, laizi_double);
					 my_double = my_double.sort(function(a,b){return a[0].value-b[0].value;});
					 var tempArr = [];
					 var item = [];
					 for ( var i = 0; i < my_double.length; i++ )
					 {
						 item = my_double[i];
						 if ( tempArr.length == 0 )
						 {
							 tempArr.push(item);  
							 continue;
						 }
						 if ( my_double[i-1][0].value != my_double[i][0].value)
						 {
							 if ( item[0].sValue != 52 && item[0].sValue != 53 )
							 {
								 if ( item[0].value == 15 )
								 {
									 if ( laizi.count > 1 && laizi.laizi.value == 15 )
									 {
										 tempArr.push(item);
									 }
								 }
								 else
								 {
									 tempArr.push(item);
								 }
							 }
						 }
					 }
					 var length = s_data.length / 2;
					 tempArr = tempArr.sort(function(a,b){return a[0].value - b[0].value;});
					 for ( var k = 0; k < tempArr.length; k++ )
					 {
						 var n_item = [], temp = [], isP = true;
						 if ( k + length <= tempArr.length )
						 {
							 for ( var j = k; j < k+length; j++ )
							 {
								 var item = DataUtil.copyJson(tempArr[j]);
								 if ( n_item.length < 1 )
								 {
									 n_item = item;
								 }
								 else
								 {
									 Array.prototype.push.apply(n_item, item);
								 }
								 temp.push(tempArr[j][0]);
							 }
							 if ( !this.isStraight(temp) )
							 {
								 isP = false;
							 }
							 if ( isP )
							 {
								 newGroupData.push(n_item);
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
					 }
					 if ( laizi.count > 0 )
					 {
						 (function()
						 {
							 for ( var i = 0; i < newGroupData.length; i++ )
							 {
								 var item = newGroupData[i];
								 var count = 0;
								 for ( var j = 0; j < item.length; j++ )
								 {
									 if ( item[j].value == laizi.laizi.value )
									 {
										 count++;
									 }
								 }
								 if ( count > laizi.count )
								 {
									 newGroupData.splice(i, 1);
									 arguments.callee();
								 }
							 }
						 })();
					 }
					 return newGroupData;
				 },
				 /**
				  * 获取顺子
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getStright:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 var n_s_data = s_data;
					 var laizi = this.getLaiziNumber(data);
					 if ( data.length >= s_data.length )
					 {
						 n_s_data = s_data.sort(function(a,b){return a.value - b.value;});
						 var min_id = n_s_data[0].value;
						 var n_data = [];
						 for ( var i = 0; i < data.length; i++ )
						 {
							 var n_id = data[i].value;
							 if ( n_id > min_id || ( laizi.laizi && n_id == laizi.laizi.value ) )
							 {
								 if ( data[i].sValue != 52 && data[i].sValue != 53 )
								 {
									 if ( data[i].value == 15 )
									 {
										 if ( laizi.count > 0 )
										 {
											 if ( laizi.laizi.value == 15 )
											 {
												 n_data.push(data[i]);
											 }
										 }
									 }
									 else
									 {
										 n_data.push(data[i]);
									 }
								 }
							 }
						 }
						 //塞选出的牌长度小于，其他玩家牌长度，查看是否有炸弹
						 if ( n_data.length < n_s_data.length )
						 {
							 if ( is_add_king )
							 {
								 var boom = this.getBoom(data, s_data, is_add_king);
								 var laiziBoom = this.getLaiZiBoom(data);
								 if ( boom && boom.length > 0 )
								 {
									 Array.prototype.push.apply(newGroupData, boom);
								 }
								 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
							 }
							 return newGroupData;
						 }
						 //将塞选出的数据分组
						 var groupData = this.groupData(n_data);
						 //将分组中的癞子牌组拆分
						 for ( var i = 0; i < groupData.length; i++ )
						 {
							 var te = groupData[i];
							 if ( laizi.count > 0 )
							 {
								 if ( te[0].value == laizi.laizi.value )
								 {
									 for ( var m = 0; m < te.length; m++ )
									 {
										 groupData.push([te[0]]);
									 }
									 groupData.splice(i, 1);
									 break;
								 }
								 if ( laizi.laizi.value <= min_id )
								 {
									 for ( var n = 0; n < laizi.count; n++ )
									 {
										 groupData.push([laizi.laizi]);
									 }
									 break;
								 }
							 }
						 }
						 cc.log("groupData======== "+JSON.stringify(groupData));
						 cc.log("groupData======== "+JSON.stringify(groupData.length));
						 if ( groupData.length < n_s_data.length )
						 {
							 if ( is_add_king )
							 {
								 var boom = this.getBoom(data, s_data, is_add_king);
								 var laiziBoom = this.getLaiZiBoom(data);
								 if ( boom && boom.length > 0 )
								 {
									 Array.prototype.push.apply(newGroupData, boom);
								 }
								 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
							 }
							 return newGroupData;
						 }
						 //从分组中选出单牌
						 var arr = [];
						 for ( var i = 0; i < groupData.length; i++ )
						 {
							 var item = groupData[i];
							 arr.push(item[0]);
						 }
						 //如果癞子牌值小于min_id，将癞子牌加入arr中
						 if ( laizi.count > 0 )
						 {
//							 if ( laizi.laizi.value <= min_id )
//							 {
//								 for ( var i = 0; i < laizi.count; i++ )
//								 {
//									 arr.push(laizi.laizi);
//								 }
//							 }
						 }
						 
						 arr = arr.sort(function(a,b){return a.value - b.value;});
						 cc.log("arr=============== "+JSON.stringify(arr));
						 var length = n_s_data.length;
						 for ( var k = 0; k < arr.length; k++ )
						 {
							 var n_item = [];
							 if ( k + length <= arr.length )
							 {
								 for ( var s = k; s < k+length; s++ )
								 {
									 n_item.push(arr[s]);
								 }
							 }
							 n_item.sort(function(a,b){return a.value-b.value;});
							 if ( this.isStraight(n_item) && n_item.length == length )
							 {
								 var arar = [];
								 for ( var mm = 0; mm < n_item.length; mm++ )
								 {
									 arar.push(n_item[mm].sortNumber);
								 }
								 var result = this.handleOutPuker(arar);
								 result = result[0];
								 var data = this.getPukerData(result);
								 data.sort(function(a, b){a.value - b.value});
								 if ( data[0].value > min_id )
								 {
									 newGroupData.push(n_item);
								 }
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
					 }
					 return newGroupData;
				 },
				 /**
				  * 获取四带两对
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getFourByTwoCard:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 if ( data.length >= s_data.length )
					 {
						 var laizi = this.getLaiziNumber(data);
						 var testData = [{"value":0,"sValue":5},{"value":0,"sValue":5},{"value":0,"sValue":5}];
						 //获取对方四带的牌
						 var o_four = this.getBoom(s_data, null, false);
						 //获取自己的四带牌
						 var my_four = this.getBoom(data, o_four[0], false);
						 //获取自己的对牌
						 var myDouble  = this.getDoubleCard(data, testData, false);
						 if ( my_four.length > 0 )
						 {
							 //获取癞子对牌
							 var laizi_double = this.getLaiZiDouble(data, s_data);
							 myDouble = this.arrayConcatArray(myDouble, laizi_double);
							 for ( var i = 0; i < myDouble.length; i++ )
							 {
								 if ( laizi.count%2 != 0 ){break;}
								 if ( myDouble[i][0].value == laizi.laizi.value )
								 {
									 myDouble.splice(i, 1);
									 break;
								 }
							 }
						 }
						 else 
						 {
							 //获取癞子四带的牌
							 var laizi_four = this.getLaiZiBoom(data, o_four[0]);
							 my_four = this.arrayConcatArray(my_four, laizi_four);
							 for ( var i = 0; i < myDouble.length; i++ )
							 {
								 if ( laizi.count < 1){break;}
								 if ( myDouble[i][0].value == laizi.laizi.value )
								 {
									 myDouble.splice(i, 1);
									 break;
								 }
							 }
						 }
						 
						 if ( myDouble.length >= 2 )
						 {
							 for ( var i = 0; i < my_four.length; i++ )
							 {
								 var item = my_four[i];
								 var my_selectId = item[0].value;
								 var temp = [];
								 for ( var j = 0; j < myDouble.length; j++ )
								 {
									 var id = myDouble[j][0].value;
									 if ( my_selectId != id )
									 {
										 temp.push(myDouble[j]);
									 }
								 }
								 temp.sort(function(a,b){a[0].value-b[0].value;});
								 for ( var k = 1; k < temp.length; k++ )
								 {
									 var item2 = DataUtil.copyJson(item);
									 Array.prototype.push.apply(item2, temp[k-1]);
									 Array.prototype.push.apply(item2, temp[k]);
									 newGroupData.push(item2);
								 }
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
					 }
					 return newGroupData;
				 },
				 /**
				  * 获取四带两单
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getFourByOneCard:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 if ( data.length >= s_data.length )
					 {
						 var laizi = this.getLaiziNumber(data);
						 //获取对方四带的牌
						 var o_four = this.getBoom(s_data, null, false);
						 //获取自己的四带牌
						 var my_four = this.getBoom(data, o_four[0], false);
						 //获取癞子四带的牌
						 var laizi_four = this.getLaiZiBoom(data, o_four[0]);
						 my_four = this.arrayConcatArray(my_four, laizi_four);
						 var copyData = DataUtil.copyJson(data);
						 data = this.groupData(data);
						 for ( var i = 0; i < my_four.length; i++ )
						 {
							 var item = my_four[i];
							 var my_selectId = item[0].value;
							 var temp = [];
							 for ( var j = 0; j < data.length; j++ )
							 {
								 var id = data[j][0].value;
								 if ( my_selectId != id )
								 {
									 if ( laizi_four.length > 0 )
									 {
										 if ( id != laizi.laizi.value )
										 {
											 temp.push(data[j][0]);
										 }
									 }
									 else
									 {
										 temp.push(data[j][0]);
									 }
								 }
							 }
							 temp.sort(function(a,b){return a.value - b.value;});
							 for ( var k = 1; k < temp.length; k++ )
							 {
								 var item2 = DataUtil.copyJson(item);
								 item2.push(temp[k-1]);
								 item2.push(temp[k]);
								 newGroupData.push(item2);
							 }
						 }
					 }

					 if ( is_add_king )
					 {
						 var boom = this.getBoom(copyData, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(copyData);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
					 }
					 return newGroupData;
				 },
				 /**
				  * 获取三带一对
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getThreeByTwoCard:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 if ( data.length >= s_data.length )
					 {
						 var laizi = this.getLaiziNumber(data);
						 var testData = [{"value":-1,"sValue":5},{"value":-1,"sValue":5},{"value":-1,"sValue":5}];
						 //获取对方三带的牌
						 var otherThreeArray = this.getThreeCard(s_data, testData, false);
						 var selectID = otherThreeArray[0][0].value;
						 //得到自己大于对方的三带牌
						 var groupData = this.getThreeCard(data, otherThreeArray[0], false);
						 //获取自己的对牌
						 var myDouble  = this.getDoubleCard(data, testData, false);
						 //癞子只能用一次，要么组成三带牌，要么组成对牌
						 if ( groupData.length > 0 )
						 {
							 //如果有三带牌，则组对牌
							 //癞子对牌
							 var laiziDouble = this.getLaiZiDouble(data, s_data);
							 myDouble = this.arrayConcatArray(myDouble, laiziDouble);
						 }
						 else
						 {
							 //如果没有三带牌，则组三带牌
							 //癞子三带牌
							 var laiziThree = this.getLaiZiThree(data, otherThreeArray[0]);
							 groupData = this.arrayConcatArray(groupData, laiziThree);
							 for ( var i = 0; i < myDouble.length; i++ )
							 {
								 if ( laizi.count%2 != 0 ){break;}
								 //不能在三带和对牌中重复使用癞子牌，当癞子牌个数为2的整数倍时
								 if ( myDouble[i][0].value == laizi.laizi.value )
								 {
									 myDouble.splice(i, 1);
									 break;
								 }
							 }
						 }
						 for ( var i = 0; i < groupData.length; i++ )
						 {
							 var item = groupData[i];
							 var m_selectId = item[0].value;
							 for ( var j = 0; j < myDouble.length; j++ )
							 {
								 var item2 = myDouble[j];
								 if ( laizi.count > 2 )
								 {
									 if ( m_selectId == laizi.laizi.value )
									 {
										 if ( item2[0].value == m_selectId || item2[1].value == m_selectId )
										 {
											 continue;
										 }
									 }
								 }
								 
								 var m_selectId2 = item2[0].value;
								 if ( m_selectId != m_selectId2 && item.length < 5 )
								 {
									 var itempT = DataUtil.copyJson(item);
									 Array.prototype.push.apply(itempT, item2);
									 newGroupData.push(itempT);
								 }
							 }
						 }
					 }

					 if ( is_add_king )
					 {
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 //if ( laiziBoom && laiziBoom.length > 0 )
						 //{
							// for ( var i = 0; i < laiziBoom.length; i++ )
							// {
							//	 for ( var j = 0; j < laiziBoom[i].length; j++ )
							//	 {
							//		 laiziBoom[i][j].sortTag = 1;
							//	 }
							// }
						 //}
						 if ( boom && boom.length > 0 )
						 {
							 //for ( var i = 0; i < boom.length; i++ )
							 //{
								// for ( var j = 0; j < boom[i].length; j++ )
								// {
								//	 boom[i][j].sortTag = 1;
								// }
							 //}
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
					 }
					 newGroupData.sort(function(a, b){return a[0].value - b[0].value;})
					 return newGroupData;
				 },
				 /**
				  * 获取三带一
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getThreeByOneCard:function(data, s_data, is_add_king)
				 {
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 if ( data.length >= s_data.length )
					 {
						 var laizi = this.getLaiziNumber(data);
						 var testData = [{"value":-1,"sValue":5},{"value":-1,"sValue":5},{"value":-1,"sValue":5}];
						 //获取对方三带的牌
						 var otherThreeArray = this.getThreeCard(s_data, testData, false);
						 var selectID = otherThreeArray[0][0].value;
						 //得到自己大于对方的三带牌
						 var groupData = this.getThreeCard(data, otherThreeArray[0], false);
						 //癞子三带牌
						 var laiziThree = this.getLaiZiThree(data, otherThreeArray[0]);
						 groupData = this.arrayConcatArray(groupData, laiziThree);
						 data = data.sort(function(a,b){return a.value-b.value;});

						 var group = this.groupData(data);
						 group.sort(function(a, b){return a.length - b.length;});
						 group.sort(function(a, b){return a[0].value - b[0].value;});
						 for ( var i = 0; i < group.length; i++ )
						 {
							 var it = group[i];
							 if ( it.length > 1 )
							 {
								 for ( var j = 0; j < group[i].length; j++ )
								 {
									 group[i][j].sortTag = 1;
								 }
							 }
						 }
						 group.sort(function(a, b){return a[0].sortTag - b[0].sortTag;});

						 for ( var i = 0; i < group.length;i++ )
						 {
							 var id1 = group[i][0].value;
							 for ( var j = 0; j < groupData.length; j++ )
							 {
								 var item = groupData[j];
								 var id2 = item[0].value;
								 if ( id2 != id1 && item.length < 4 )
								 {
									 if (laiziThree && laiziThree.length > 0 )
									 {
										 if ( id1 != laizi.laizi.value )
										 {
											 var arr = item;
											 arr.push(group[i][0]);
											 newGroupData.push(arr);
										 }
									 }
									 else
									 {
										 var arr = item;
										 arr.push(group[i][0]);
										 newGroupData.push(arr);
									 }
								 }
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 //if ( laiziBoom && laiziBoom.length > 0 )
						 //{
							// for ( var i = 0; i < laiziBoom.length; i++ )
							// {
							//	 for ( var j = 0; j < laiziBoom[i].length; j++ )
							//	 {
							//		 laiziBoom[i][j].sortTag = 1;
							//	 }
							// }
						 //}
						 if ( boom && boom.length > 0 )
						 {
							 //for ( var i = 0; i < boom.length; i++ )
							 //{
								// for ( var j = 0; j < boom[i].length; j++ )
								// {
								//	 boom[i][j].sortTag = 1;
								// }
							 //}
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laiziBoom);
					 }
					 newGroupData.sort(function(a, b){return a[0].value - b[0].value;})
					 return newGroupData;
				 },
				 /**
				  * 获取三不带
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @param bool 是否只获取三牌
				  * @returns {Array}
				  */
				 getThreeCard:function(data, s_data, is_add_king, bool)
				 {
					 s_data = (s_data && s_data.length> 1 ) ? s_data : [{value:0, sValue:1},{value:0, sValue:1},{value:0, sValue:1}];
					 if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
					 var newGroupData = [];
					 if ( data.length >= s_data.length )
					 {
						 cc.log("s_data= "+JSON.stringify(s_data));
						 //将数据进行分组
						 var groupData = this.groupData(data);
						 groupData = groupData.sort(function(a,b){return a[0].value-b[0].value;});
						 var selectID = s_data[1].value;
						 for ( var i = 0; i < groupData.length; i++ )
						 {
							 var item = groupData[i];
							 if ( bool )
							 {
								 if ( item.length > 3 )
								 {
									 continue;
								 }
							 }
							 if ( item.length == 3 )
							 {
								 if ( item[0].value > selectID )
								 {
									 newGroupData.push(item);
								 }
							 }
							 else if ( item.length == 4 )
							 {
								 if ( item[0].value > selectID )
								 {
									 newGroupData.push([item[0], item[1], item[2]]);
								 }
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 var three = this.getLaiZiThree(data, s_data);
						 var laiziboom = this.getLaiZiBoom(data);
						 var boom = this.getBoom(data, s_data, is_add_king);
						 //if ( laiziboom && laiziboom.length > 0 )
						 //{
							// for ( var i = 0; i < laiziboom.length; i++ )
							// {
							//	 for ( var j = 0; j < laiziboom[i].length; j++ )
							//	 {
							//		 laiziboom[i][j].sortTag = 1;
							//	 }
							// }
						 //}
						 if ( boom && boom.length > 0 )
						 {
							 //for ( var i = 0; i < boom.length; i++ )
							 //{
								// for ( var j = 0; j < boom[i].length; j++ )
								// {
								//	 boom[i][j].sortTag = 1;
								// }
							 //}
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, three, laiziboom);
					 }
					 return newGroupData;
				 },
				 /**
				  * 获取对牌
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @param bool 是否只获取对牌
				  * @returns {Array}
				  */
				 getDoubleCard:function(data, s_data, is_add_king, bool)
				 {
					 if ( !s_data || s_data.length == 0 ){return [];}
					 var newGroupData = [];
					 if ( data.length >= s_data.length )
					 {
						 //将牌进行分组
						 var groupData = this.groupData(data);
						 groupData = groupData.sort(function(a,b){return a[0].value-b[0].value;});
						 var selectID = s_data[0].value;
						 for ( var i = 0; i < groupData.length; i++ )
						 {
							 var item = groupData[i];
							 if ( bool )
							 {
								 if ( item.length > 2 )
								 {
									 continue;
								 }
							 }
							 if ( item.length == 2 )
							 {
								 if ( item[0].value >selectID && item[0].sValue != 52 && item[0].sValue != 53 )
								 {
									 newGroupData.push(item);
								 }
							 }
							 else if ( item.length == 3 )
							 {
								 if ( item[0].value > selectID )
								 {
									 item[0].sortTag = 1;
									 item[1].sortTag = 1;
									 newGroupData.push([item[0], item[1]]);
								 }
							 }
							 else if ( item.length == 4 )
							 {
								 if ( item[0].value > selectID )
								 {
									 item[0].sortTag = 1;
									 item[1].sortTag = 1;
									 newGroupData.push([item[0], item[1]]);
								 }
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 var laizi = this.getLaiZiDouble(data, s_data);
						 var laiziBoom = this.getLaiZiBoom(data);
						 var boom = this.getBoom(data, s_data, is_add_king);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(newGroupData, boom);
						 }
						 newGroupData = this.arrayConcatArray(newGroupData, laizi, laiziBoom);
					 }
					 return newGroupData;
				 },
				 /**
				  * 获取癞子牌个数和癞子牌
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @returns {Number}
				  */
				 getLaiziNumber:function(data)
				 {
					 var obj = {count:0, laizi:null};
					 if ( !data || !laiziNum ){return 0; }
					 var laizi = this.getPukerData([laiziNum])[0];
					 var count = 0;
					 for ( var i = 0; i < data.length; i++ )
					 {
						 if ( data[i].value == laizi.value )
						 {
							 count++;
						 }
					 }
					 obj = {count:count, laizi:laizi};
					 if ( !sparrowDirector.gameData.laiziValue )
					 {
						 if ( laizi )
						 {
							 sparrowDirector.gameData.laiziValue = laizi;
						 }
					 }
					 //cc.log("laizi= "+JSON.stringify(laizi));
					 //cc.log("laiziobj= "+JSON.stringify(obj));
					 return obj;
				 },
				 /**
				  * 获取癞子三张
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @returns {Array}
				  */
				 getLaiZiThree:function(data, s_data)
				 {
					 //癞子加入
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var lNum = laizi.count;
					 var ss_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
					 var s_data = s_data ? s_data : ss_data;
					 if ( lNum < 1 ){return [];}
					 var one = [];
					 var two = [];
					 cc.log("lnum= "+lNum);
					 if ( lNum == 1 )
					 {
						 var double = this.getDoubleCard(data, s_data, false, true);
						 if ( double.length == 2 )
						 {
							 if ( double[0][0].value > double[1][0].value )
							 {
								 double.splice(1, 1);
							 }
							 else
							 {
								 double.splice(0, 1);
							 }
						 }
						 for ( var i = 0; i < double.length; i++ )
						 {
							 var item = double[i];
							 if ( item[0].sValue != 52 && item[0].sValue != 53 && item[0].laiziNum < 1 )
							 {
								 item.push(laizi.laizi);
								 one .push(item);
							 }
						 }
						 one.sort(function(a, b){return a[0].value - b[0].value;})
						 return one;
					 }
					 else if ( lNum == 2 )
					 {
						 var double = this.getDoubleCard(data, s_data, false, true);
						 
						 for ( var i = 0; i < double.length; i++ )
						 {
							 var item = double[i];
							 if ( item[0].sValue != 52 && item[0].sValue != 53 && item[0].laiziNum < 1 )
							 {
								 item.push(laizi.laizi);
								 one .push(item);
							 }
						 }
						 
						 var single = this.getSingleCard(data, s_data, false, true);
						 for ( var i = 0; i < single.length; i++ )
						 {
							 var item = single[i];
							 if ( item[0].sValue != 52 && item[0].sValue != 53 && item[0].laiziNum < 1 )
							 {
								 item.push(laizi.laizi);
								 item.push(laizi.laizi);
								 two .push(item);
							 }
						 }
						 var result = this.arrayConcatArray(two, one);
						 result.sort(function(a, b){return -a[0].value + b[0].value;})
						 return result;
					 }
					 else if ( lNum == 3 || lNum == 4 )
					 {
						 var double = this.getDoubleCard(data, s_data, false, true);
						 for ( var i = 0; i < double.length; i++ )
						 {
							 var item = double[i];
							 if ( item[0].sValue != 52 && item[0].sValue != 53 && item[0].laiziNum < 1 )
							 {
								 item.push(laizi.laizi);
								 one .push(item);
							 }
						 }
						 var single = this.getSingleCard(data, s_data, false, true);
						 for ( var i = 0; i < single.length; i++ )
						 {
							 var item = single[i];
							 if ( item[0].sValue != 52 && item[0].sValue != 53 && item[0].laiziNum < 1 )
							 {
								 item.push(laizi.laizi);
								 item.push(laizi.laizi);
								 two .push(item);
							 }
						 }
						 var result = this.arrayConcatArray(one, two);
						 result.sort(function(a, b){return a[0].value - b[0].value;})
						 return result;
					 }
				 },
				 /**
				  * 获取癞子对牌
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @returns {Array}
				  */
				 getLaiZiDouble:function(data, s_data)
				 {
					 //癞子加入
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var lNum = laizi.count;
					 var ss_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
					 var s_data = s_data ? s_data : ss_data;
					 if ( lNum < 1 ){return [];}
					 
					 var single = this.getSingleCard(data, s_data, false, true);
					 var one = [];
					 for ( var i = 0; i < single.length; i++ )
					 {
						 var item = single[i];
						 if ( item[0].sValue != 52 && item[0].sValue != 53 && item[0].laiziNum < 1 )
						 {
							 item.push(laizi.laizi);
							 one .push(item);
						 }
					 }
					 return one;
				 },
				 /**
				  * 获取癞子炸弹
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @returns {Array}
				  */
				 getLaiZiBoom:function(data, s_data)
				 {
					 //癞子加入
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var lNum = laizi.count;
					 var ss_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
					 var s_data = s_data ? s_data : ss_data;
					 if ( lNum < 1 ){return [];};
					 var threeTemp = [];
					 var twoTemp = [];
					 var oneTemp = [];
					 if ( lNum == 1 )
					 {
						 var three = this.getThreeCard(data, s_data, false, true);
						 for ( var i = 0; i < three.length; i++ )
						 {
							 if ( three[i][0].sValue == 52 || three[i][0].sValue == 53 || three[i][0].value == laizi.laizi.value )
							 {
								 continue;
							 }
							 for ( var m = 0; m < 3; m++ )
							 {
								 three[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 1;
							 three[i].push(laizi.laizi);
							 threeTemp.push(three[i]);
						 }
						 return threeTemp;
					 }
					 else if ( lNum == 2 )
					 {
						 var three = this.getThreeCard(data, s_data, false, true);
						 for ( var i = 0; i < three.length; i++ )
						 {
							 if ( three[i][0].sValue == 52 || three[i][0].sValue == 53 || three[i][0].value == laizi.laizi.value )
							 {
								 continue;
							 }
							 for ( var m = 0; m < 3; m++ )
							 {
								 three[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 2;
							 three[i].push(laizi.laizi);
							 threeTemp.push(three[i]);
						 }
						 
						 var two = this.getDoubleCard(data, s_data, false, true);
						 
						 for ( var i = 0; i < two.length; i++ )
						 {
							 if ( two[i][0].sValue == 52 || two[i][0].sValue == 53 || two[i][0].value == laizi.laizi.value )
							 {
								 continue;
							 }
							 for ( var m = 0; m < 2; m++ )
							 {
								 two[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 2;
							 two[i].push(laizi.laizi);
							 two[i].push(laizi.laizi);
							 twoTemp.push(two[i]);
						 }
						 var temp = this.arrayConcatArray(threeTemp, twoTemp);
						 return temp;
					 }
					 else if ( lNum == 3 )
					 {
						 var three = this.getThreeCard(data, s_data, false, true);
						 for ( var i = 0; i < three.length; i++ )
						 {
							 if ( three[i][0].sValue == 52 || three[i][0].sValue == 53 || three[i][0].value == laizi.laizi.value)
							 {
								 continue;
							 }
							 for ( var m = 0; m < 3; m++ )
							 {
								 three[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 2;
							 three[i].push(laizi.laizi);
							 threeTemp.push(three[i]);
						 }

						 var two = this.getDoubleCard(data, s_data, false, true);
						 for ( var i = 0; i < two.length; i++ )
						 {
							 if ( two[i][0].sValue == 52 || two[i][0].sValue == 53 || two[i][0].value == laizi.laizi.value )
							 {
								 continue;
							 }
							 for ( var m = 0; m < 2; m++ )
							 {
								 two[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 2;
							 two[i].push(laizi.laizi);
							 two[i].push(laizi.laizi);
							 twoTemp.push(two[i]);
						 }
						 
						 var one = this.getSingleCard(data, s_data, false, false, true);
						 for ( var i = 0; i < one.length; i++ )
						 {
							 if ( one[i][0].sValue == 52 || one[i][0].sValue == 53 || one[i][0].value == laizi.laizi.value)
							 {
								 continue;
							 }
							 one[i][0].sortTag = 2;
							 laizi.laizi.sortTag = 2;
							 one[i].push(laizi.laizi);
							 one[i].push(laizi.laizi);
							 one[i].push(laizi.laizi);
							 oneTemp.push(one[i]);
						 }
						 var temp = this.arrayConcatArray(threeTemp, twoTemp,oneTemp);
						 return temp;
					 }
					 else if ( lNum == 4 )
					 {
						 var three = this.getThreeCard(data, s_data, false, true);
						 for ( var i = 0; i < three.length; i++ )
						 {
							 if ( three[i][0].sValue == 52 || three[i][0].sValue == 53 || three[i][0].value == laizi.laizi.value )
							 {
								 continue;
							 }
							 for ( var m = 0; m < 3; m++ )
							 {
								 three[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 2;
							 three[i].push(laizi.laizi);
							 threeTemp.push(three[i]);
						 }

						 var two = this.getDoubleCard(data, s_data, false, true);
						 for ( var i = 0; i < two.length; i++ )
						 {
							 if ( two[i][0].sValue == 52 || two[i][0].sValue == 53 || two[i][0].value == laizi.laizi.value )
							 {
								 continue;
							 }
							 for ( var m = 0; m < 3; m++ )
							 {
								 if ( !two[i][m] )
								 {
									 break;
								 }
								 two[i][m].sortTag = 2;
							 }
							 laizi.laizi.sortTag = 2;
							 two[i].push(laizi.laizi);
							 two[i].push(laizi.laizi);
							 twoTemp.push(two[i]);
						 }

						 var one = this.getSingleCard(data, s_data, false, false, true);
						 for ( var i = 0; i < one.length; i++ )
						 {
							 if ( one[i][0].sValue == 52 || one[i][0].sValue == 53 || one[i][0].value == laizi.laizi.value)
							 {
								 continue;
							 }
							 one[i][0].sortTag = 2;
							 laizi.laizi.sortTag = 2;
							 one[i].push(laizi.laizi);
							 one[i].push(laizi.laizi);
							 one[i].push(laizi.laizi);
							 oneTemp.push(one[i]);
						 }
						 var temp = this.arrayConcatArray(threeTemp, twoTemp,oneTemp);
						 temp.push([laizi.laizi,laizi.laizi,laizi.laizi,laizi.laizi])
						 return temp;
					 }
				 },
				 /**
				  * 获取单牌
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @param bool 是否只获取单牌
				  * @returns {Array}
				  */
				 getSingleCard:function(data, s_data, is_add_king, bool)
				 {
					 cc.log("----------------获取单牌")
					 var selectedId = 0;
					 var newGroup   = [];
					 //将牌进行分组
					 var group = this.groupData(data);
					 var item = null;
					 if ( s_data && s_data.length > 0 )
					 {
						 //其他用户出的牌
						 selectedId = s_data[0].value;
					 }
					 for ( var i = 0; i < group.length; i++ )
					 {
						 item = group[i];
						 if ( bool )
						 {
							 //只获取单牌
							 if ( item.length > 1 )
							 {
								 continue;
							 }
						 }
						 //大鬼或小鬼
						 if ( (s_data[0].sValue == 52 || s_data[0].sValue == 53))
						 {
							 if ( (item[0].sValue == 53 || item[0].sValue == 52))
							 {
								 if ( item.length == 1 && item[0].value > selectedId)
								 {
									 item.sortTag = 1;
									 newGroup.push(item);
								 }
								 else if ( item.length > 1 )
								 {
									 if (item[0].value > selectedId)
									 {
										 item[0].sortTag = 1;
										 newGroup.push([item[0]]);
									 }
									 else if (item[1].value > selectedId)
									 {
										 item[1].sortTag = 1;
										 newGroup.push([item[1]]);
									 }
								 }
							 }
						 }
						 else//普通牌 
						 {
							 if ( item[0].value > selectedId )
							 {
								 if ( item.length == 1 )
								 {
									 newGroup.push(item);
								 }
								 else if ( item.length > 1 )
								 {
									 item[0].sortTag = 1;
									 newGroup.push([item[0]]);
								 }
							 }
							 if ( item[0].sValue == 53 || item[0].sValue == 52)
							 {
								 if ( item.length == 1 )
								 {
									 item.sortTag = 1;
									 newGroup.push(item);
								 }
								 else if ( item.length > 1 )
								 {
									 item[0].sortTag = 1;
									 newGroup.push([item[0]]);
								 }
							 }
						 }
					 }

					 if ( is_add_king )
					 {
						 //查找炸弹
						 var boom = this.getBoom(data, s_data, is_add_king);
						 var laiziBoom = this.getLaiZiBoom(data);
						 if ( boom && boom.length > 0 )
						 {
							 Array.prototype.push.apply(newGroup, boom);
						 }
						 newGroup = this.arrayConcatArray(newGroup, laiziBoom);
						 
						 


//						 var boom = this.getBoom(data, s_data, is_add_king);
//						 if ( boom && boom.length > 0 )
//						 {
//							 Array.prototype.push.apply(newGroup, boom);
//						 }
					 }
					 return newGroup;
				 },
				 /**
				  * 获取炸弹
				  * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
				  * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
				  * @param is_add_king 是否查找炸弹
				  * @returns {Array}
				  */
				 getBoom:function(data, s_data, is_add_king)
				 {
					 if ( !data || data.length == 0 ){return []}
					 //将牌进行分组
					 var groupData = this.groupData(data);
					 var selectId = 0;
					 if ( s_data && s_data.length == 4 && this.isSamecard(s_data) )
					 {
						 selectId = s_data[0].value;
					 }
					 cc.log(selectId+"  -----------------------");
					 var newGroupData = [];
					 groupData.sort(function(a,b){return a[0].value - b[0].value;});
					 for ( var i = 0; i < groupData.length; i++ )
					 {
						 var item = groupData[i];
						 if ( item.length == 4 )
						 {
							 if ( selectId == 0 )
							 {
								 for ( var m = 0; m < 4; m++ )
								 {
									 item[m].sortTag = 2;
								 }
								 newGroupData.push(item);
							 }
							 else if ( item[0].value > selectId )
							 {
								 for ( var m = 0; m < 4; m++ )
								 {
									 item[m].sortTag = 2;
								 }
								 newGroupData.push(item);
							 }
						 }
					 }
					 if ( is_add_king )
					 {
						 //双鬼
						 var kingArray = this.kingGroup(data);
						 if ( kingArray.length == 2 )
						 {
							 newGroupData.push(kingArray);
						 }
					 }
					 cc.log(selectId+"  -----------------------"+JSON.stringify(newGroupData))
					 return newGroupData;
				 },
				 /*
				  * 所选的牌是否相同 （可以判断 对子， 炸弹）true 是 false 否
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {boolean}
				  */
				 isSamecard:function(data)
				 {
					 if ( !data || data.length < 2 )
					 {
						 return false;
					 }
					 else
					 {
						 data = data.sort(function(a,b){return a.value-b.value;})
						 //判断是否有癞子牌
						 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
						 //去掉鬼牌
						 for ( var i = 0; i < data.length - 1; i++ )
						 {
							 if ( data[i].sValue == 52 || data[i+1].sValue == 53 || data[i].sValue == 53 || data[i+1].sValue == 52 )
							 {
								 return false;
							 }
						 }
						 var i = 0;
						 var bool = 0;
						 for ( var j = 0; j < data.length - 1; j++ )
						 {
							 if ( data[j].value != data[j+1].value )
							 {
								 bool++;
							 }
						 }
						 if ( data.length == 2 )
						 {
							 if ( bool > 0 )
							 {
								 cc.log(laizi.count);
								 if ( laizi.count < 1 )
								 {
									 return false;
								 }
							 }
						 }
						 else if ( data.length == 3 )
						 {
							 if ( laizi.count == 0 )
							 {
								 if ( bool > 0 )
								 {
									 return false;
								 }
							 }
							 else if ( laizi.count == 1 )
							 {
								 if ( bool > 1 )
								 {
									 return false;
								 }
							 }
						 }
						 else if ( data.length == 4 )
						 {
							 if ( laizi.count == 0 )
							 {
								 if ( bool > 0 )
								 {
									 return false;
								 }
							 }
							 else if ( laizi.count == 1 )
							 {
								 if ( bool > 1 )
								 {
									 return false;
								 }
							 }
							 else if ( laizi.count == 2 )
							 {
								 if ( bool > 1 )
								 {
									 return false;
								 }
							 }
						 }
					 }
					 return true;
				 },
				 /*
				  * 判断是否为3带n
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {boolean}
				  */
				 isThreeByOther:function(data)
				 {
					 if ( !data || data.length < 4 )
					 {
						 return false; 
					 }
					 data = data.sort(function(a,b){return a.value-b.value;})
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var num = 0;
					 for ( var i = 0; i < data.length-1; i++ )
					 {
						 if ( data[i].value != data[i+1].value )
						 {
							 num++;
						 }
					 }
					 
					 if ( num == 0 )
					 {
						 return false;
					 }
					 else if ( num == 1)
					 {
						 if ( laizi.count < 1 )
						 {
							 var groupData = this.groupData(data);
							 var groupOne = [], groupTwo = [], groupThree = [];
							 for ( var i = 0; i < groupData.length; i++ )
							 {
								 if ( groupData[i].length == 1 )
								 {
									 groupOne.push(groupData[i]);
								 }
								 else if ( groupData[i].length == 2 )
								 {
									 groupTwo.push(groupData[i]);
								 }
								 else if ( groupData[i].length == 3 )
								 {
									 groupThree.push(groupData[i]);
								 }
							 }
							 if ( groupThree.length !=1 )
							 {
								 return false;
							 }
						 }
					 }
					 else if ( num == 2 )
					 {
						 if ( laizi.count < 1 )
						 {
							 return false;
						 }
					 }
					 else if ( num > 2 )
					 {
						 return false;
					 }
					 return true; 
				 },
				 /*
				  * 查找鬼牌，大鬼，小鬼
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {array}
				  */
				 kingGroup:function(data)
				 {
					 var arr = [];
					 if ( !data ){return arr;}
					 for ( var i = 0; i < data.length; i++ )
					 {
						 if ( data[i].sValue == 52 || data[i].sValue == 53 )
						 {
							 data[i].sortTag = 1;
							 arr.push(data[i]);
							 if ( arr.length == 2 )
							 {
								 arr[0].sortTag = 3;
								 arr[1].sortTag = 3;
								 break;
							 }
						 }
					 }
					 return arr;
				 },
				 /*
				  * 将用户的牌进行分组
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {array}
				  */
				 groupData:function(data)
				 {
					 var arr = [];
					 if ( !data ){return arr;}
					 var kingGroup = this.kingGroup(data);
					 if ( kingGroup.length > 0 )
					 {
						 //将双王排在最前面
						 arr.push(kingGroup);
					 }
					 //cc.log("kinggourp = "+JSON.stringify(arr));

					 var item = [];
					 var isP  = false;
					 for ( var i = 0; i < data.length; i++ )
					 {
						 var isP  = false;
						 if ( kingGroup.length > 0 )
						 {
							 //如果当前用户有双王且循环到的id值为两个王的id值，该次分组不执行
							 if ( data[i].sValue == 52 || data[i].sValue == 53 )
							 {
								 continue;
							 }
						 }
						 if ( arr.length == 0 )
						 {
							 item = [];
							 item.push(data[i]);
							 arr.push(item);
							 continue;
						 }
						 for ( var j = 0; j < arr.length; j++ )
						 {
							 if ( (data[i].value == arr[j][0].value) && (arr[j][0].sValue != 52) && (arr[j][0].sValue != 53))
							 {
								 arr[j].push(data[i]);
								 isP = true;
								 break;
							 }
						 }
						 if ( isP ) { continue;}
						 item = [];
						 item.push(data[i]);
						 arr.push(item);
					 }
					 return arr;
				 },
				 /*
				  * 判断是否为顺子 true 是 false 否
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {boolean}
				  */
				 isStraight:function(data)
				 {
					 if ( !data ){return false;}
					 
					 data = data.sort(function(a,b){return a.value-b.value;})
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var num = 0, arr = [], rArr = [];
					 var needCard = 0;//需要补缺的牌数量
					 for ( var i = 0; i < data.length; i++ )
					 {
						 //如果有A,2,大鬼，小鬼，则还回false
						 if ( data[i].sValue == 52 || data[i].sValue == 53 )
						 {
							 return false;
						 }
						 if ( data[i].value == 15 )
						 {
							 if ( laizi.count > 0 )
							 {
								 //当2为癞子时
								 if ( laizi.laizi.value == 15 )
								 {
									 continue;
								 }
								 else
								 {
									 return false;
								 }
							 }
							 else
							 {
								 return false;
							 }
						 }
						 //将非癞子牌塞选出来
						 if (laizi.laizi && data[i].value != laizi.laizi.value )
						 {
							 rArr.push(data[i]);
						 }
					 }
					 for ( var j = 1; j < rArr.length; j++ )
					 {
						 var value = rArr[j].value - rArr[j-1].value;
						 if ( Math.abs(value) < 1 ){return false;}
						 if ( Math.abs(value) != 1 )
						 {
							 num++
							 if ( Math.abs(value) < 1)
							 {
								 return false;
							 }
							 arr.push(Math.abs(value));
						 }
					 }
					 for ( var i = 0; i < arr.length;i++ )
					 {
						 //需要补缺的牌数量
						 needCard += arr[i]-1;
					 }
					 if ( num > 0 )
					 {
						 if ( needCard > laizi.count )
						 {
							 return false;
						 }
					 }
					 return true;
				 },
				 /*
				  * 判断是否4带n true 是 false 否
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {boolean}
				  */
				 isFourByOther:function(data)
				 {
					 if ( !data || data.length < 6 ){return false;}
					 data = data.sort(function(a,b){return a.value-b.value;})
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var num = 0;
					 for ( var i = 0; i < data.length-1; i++ )
					 {
						 if ( data[i].value != data[i+1].value )
						 {
							 num++;
						 }
					 }
					 var arr = [[],[],[],[]];
					 for ( var i = 0; i < data.length; i++ )
					 {
						 var card = data[i];
						 if ( arr[0].length == 0 )
						 {
							 arr[0].push(card);
							 continue;
						 }
						 if ( arr[0][0].value == card.value && card.sValue != 52 && card.sValue != 53 )
						 {
							 arr[0].push(card);
							 continue;
						 }
						 if ( arr[1].length == 0 )
						 {
							 arr[1].push(card);
							 continue;
						 }
						 if ( arr[1][0].value == card.value && card.sValue != 52 && card.sValue != 53  )
						 {
							 arr[1].push(card);
							 continue;
						 }
						 if ( arr[2].length == 0 )
						 {
							 arr[2].push(card);
							 continue;
						 }
						 if ( arr[2][0].value == card.value && card.sValue != 52 && card.sValue != 53  )
						 {
							 arr[2].push(card);
							 continue;
						 }
						 if ( arr[3].length == 0 )
						 {
							 arr[3].push(card);
							 continue;
						 }
						 if ( arr[3][0].value == card.value && card.sValue != 52 && card.sValue != 53  )
						 {
							 arr[3].push(card);
							 continue;
						 }
					 }
					 var len1 = arr[0].length;
					 var len2 = arr[1].length;
					 var len3 = arr[2].length;
					 var len4 = arr[3].length;
					 var arr11 = [len1, len2, len3,len4], mm = 0, nn = 0, oo = 0, pp = 0;
					 for ( var i = 0; i < arr.length; i++ )
					 {
						 if ( arr11[i] == 1 )
						 {
							 mm++;
						 }
						 else if ( arr11[i] == 2 )
						 {
							 nn++;
						 }
						 else if ( arr11[i] == 3 )
						 {
							 oo++;
						 }
						 else if ( arr11[i] == 4 )
						 {
							 pp++;
						 }
					 }
					 if ( data.length == 6 )//四带两单
					 {
						 if ( arr[0].length == 4 || arr[1].length == 4 || arr[2].length == 4 || arr[3].length == 4)
						 {
							 return true;
						 }
						 if ( laizi.count == 1 )
						 {
							 if ( arr[0].length == 3 || arr[1].length == 3 || arr[2].length == 3 || arr[3].length == 3)
							 {
								 return true;
							 }
						 }
						 else if ( laizi.count == 2 )
						 {
							 if ( pp || oo )
							 {
								 return true;
							 }
							 if ( nn >= 2 )
							 {
								 return true;
							 }
						 }
						 else if (laizi.count > 2 )
						 {
							 return true;
						 }
					 }
					 else if ( data.length == 8 )//四带两对
					 {
						 if ( (len1 == 4) && (len2 == 2) && (len3 == 2) )
						 {
							 return true;
						 }
						 if ( (len2 == 4) && (len1 == 2) && (len3 == 2) )
						 {
							 return true;
						 }
						 if ( (len3 == 4) && (len1 == 2) && (len2 == 2) )
						 {
							 return true;
						 }
						 
						 if ( laizi.count == 1 )
						 {
							 
							 if ( pp )
							 {
								 if ( nn )
								 {
									 return true;
								 }
							 }
							 if ( oo )
							 {
								 if ( nn == 2 )
								 {
									 return true;
								 }
							 }
						 }
						 else if ( laizi.count == 2 )
						 {
							 if ( pp )
							 {
								 return true;
							 }
							 if ( oo )
							 {
								 if ( nn )
								 {
									 return true;
								 }
							 }
							 if ( nn > 3 )
							 {
								 return true;
							 }
						 }
						 else if ( laizi.count == 3 )
						 {
							 if ( pp || oo > 1 )
							 {
								 return true;
							 }
							 if ( nn >= 2 )
							 {
								 return true;
							 }
						 }
						 else if ( laizi.count == 4 )
						 {
							 if ( nn && oo )
							 {
								 return true;
							 }
						 }
					 }
					 return false;
				 },
				 /*
				  * 判断是否为连对 true 是 false 否
				  * @param data [{value:1-13,sValue:1-53}]
				  * @return {boolean}
				  */
				 isDoubleByDouble:function(data)
				 {
					 //数据不存在或数据的个数小于6个或数据的个数不位偶数个
					 if ( !data || data.length < 6 || data.length % 2 != 0 ){return false;}
					 data = data.sort(function(a,b){return a.value-b.value;});
					 var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
					 var arr = [];
					 var item = [];
					 var num = 0;//记录单牌个数
					 var groupData = this.groupData(data);//将牌分组
					 var temp01 = [], temp02 = [], temp03 = [], temp04 = [], temp05 = [];
					 for ( var i = 0; i < groupData.length; i++ )
					 {
						 for ( var m = 0; m < groupData[i].length; m++ )
						 {
							 var value = groupData[i][m].sValue;
							 if ( value == 52 && value == 53 )
							 {
								 return false;
							 }
						 }
						 if ( groupData[i].length == 1 )
						 {
							 num++;
							 temp01.push(groupData[i]);
						 }
						 else if ( groupData[i].length == 2 )
						 {
							 if ( laizi.count >0 && groupData[i][0].value == laizi.laizi.value )
							 {
								 temp05.push(groupData[i]);
							 }
							 else
							 {
								 temp02.push(groupData[i]);
							 }
						 }
						 else if ( groupData[i].length == 3 )
						 {
							 if ( groupData[i][0].value != laizi.laizi.value )
							 {
								 return false;
							 }
							 else
							 {
								 num++;
								 temp03.push(groupData[i]);
							 }
						 }
						 else if ( groupData[i].length == 4 )
						 {
							 if ( groupData[i][0].value != laizi.laizi.value )
							 {
								 return false;
							 }
							 else
							 {
								 temp04.push(groupData[i]);
							 }
						 }
					 }
					 cc.log("num= "+num);
					 var lNum = laizi.count, resultArr = [];
					 if ( num > 0 )
					 {
						 if ( lNum == 1 )//一个癞子，两个单牌
						 {
							 if ( num / 2 != lNum )
							 {
								 return false;
							 }
							 temp01.sort(function(a, b){return a[0].laiziNum - b[0].laiziNum;})
							 var mm = [this.arrayConcatArray(temp01[0][0], temp01[1][0])];
							 //if ( temp01[0][0].value == laizi.laizi.value )
							 //{
								// mm = [this.arrayConcatArray(temp01[1][0], temp01[0][0])];
							 //}
							 resultArr = this.arrayConcatArray(temp02, mm);
						 }
						 else if ( lNum == 2 )//两个癞子，两个单牌
						 {
							 if ( lNum != num )
							 {
								 return false;
							 }
							 var mm = [this.arrayConcatArray(temp01[0][0], temp05[0][0])];
							 var nn = [this.arrayConcatArray(temp01[1][0], temp05[0][1])];
							 resultArr = this.arrayConcatArray(temp02, mm, nn);
						 }
						 else if ( lNum == 3 ||  lNum == 4 )
						 {
							 if ( num%2 != 0 )
							 {
								 return false;
							 }
							 if ( lNum == 3 )
							 {
								 if ( num == 4 )
								 {
									 var mm = [this.arrayConcatArray(temp01[0][0], temp03[0][0])];
									 var nn = [this.arrayConcatArray(temp01[1][0], temp03[0][1])];
									 var oo = [this.arrayConcatArray(temp01[2][0], temp03[0][2])];
									 resultArr = this.arrayConcatArray(temp02, mm, nn, oo );
								 }
								 else if ( num == 2 )
								 {
									 var mm = [[temp03[0][0], temp03[0][1]]];
									 var nn = [this.arrayConcatArray(temp01[0][0], temp03[0][1])];
									 resultArr = this.arrayConcatArray(temp02, mm, nn);
								 }
								 else if ( num == 0 )
								 {
									 return false;
								 }
							 }
							 else if ( lNum == 4 )
							 {
								 if ( num == 4 )
								 {
									 var mm = [this.arrayConcatArray(temp01[0][0], temp04[0][0])];
									 var nn = [this.arrayConcatArray(temp01[1][0], temp04[0][1])];
									 var oo = [this.arrayConcatArray(temp01[2][0], temp04[0][2])];
									 var pp = [this.arrayConcatArray(temp01[3][0], temp04[0][3])];
									 resultArr = this.arrayConcatArray(temp02, mm, nn, oo, pp );
								 }
								 else if ( num == 2 )
								 {
									 var mm = [[temp04[0][0], temp04[0][1]]];
									 var oo = [this.arrayConcatArray(temp01[0][0], temp04[0][2])];
									 var pp = [this.arrayConcatArray(temp01[1][0], temp04[0][3])];
									 resultArr = this.arrayConcatArray(temp02, mm, oo, pp );
								 }
								 else if ( num == 0 )
								 {
									 var mm = [[temp04[0][0], temp04[0][1]]];
									 var nn = [[temp04[0][2], temp04[0][3]]];
									 resultArr = this.arrayConcatArray(temp02, mm, nn );
								 }
							 }
						 }
						 else if ( lNum < 1 )
						 {
							 return false;
						 }
					 }
					 else
					 {
						 if ( temp04.length > 0 )
						 {
							 var mm = [[temp04[0][0], temp04[0][1]]];
							 var nn = [[temp04[0][2], temp04[0][3]]];
							 resultArr = this.arrayConcatArray(temp02, mm, nn );
						 }
						 else if ( temp05.length > 0 )
						 {
							 resultArr = this.arrayConcatArray(temp02, temp05 );
						 }
						 else 
						 {
							 resultArr = temp02;
						 }
					 }
					 
					 cc.log("resultArr= "+JSON.stringify(resultArr));
					 //数组个数不足三个
					 arr = resultArr;
					 if ( arr.length < 3 ) {return false;}
					 var newArr = [];
					 for ( var j = 0; j < arr.length; j++ )
					 {
						 item = arr[j];
						 if ( item[0].value == 15 && laizi.laizi.value != 15 )
						 {
							 //当两个相同牌有2时
							 return false;
						 }
						 if ( item.length != 2 )
						 {
							 //数组个数不为2
							 return false;
						 }
						 if ( !this.isSamecard(item) )
						 {
							 //两个数不相同
							 return false;
						 }
						 item.sort(function(a, b){return a.laiziNum - b.laiziNum;})
						 //取其中一个装入新数组当中
						 newArr.push(item[0]);
					 }
					 cc.log("newArr= "+JSON.stringify(newArr));
					 if ( this.isStraight(newArr) )
					 {
						 return true;
					 }
					 return false;
				 },
			 //TODO
			 /*
			  * 判断是否为飞机 true 是 false 否
			  * @param data [{value:1-13,sValue:1-53}]
			  * @return {boolean}
			  */
			isThreeByThree:function(data)
			{
				if ( !data || data.length < 6 ) {return false;}
				data = data.sort(function(a,b){return a.value-b.value;})
				var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
				//将用户的牌进行分组
				var groupArray = this.groupData(data);
				cc.log("laizi.count= "+laizi.count);
				if ( laizi.count > 0 )
				{//有癞子加入的情况
					var value = laizi.laizi.value;
					var groupOne = [], groupTwo = [], groupThree = [], groupFour = [], group01 = [];//01盛放癞子牌;
					for ( var i = 0; i < groupArray.length; i++ )
					{
						var item = groupArray[i];
						if ( item.length == 1 )
						{
							if ( item[0].value == value )
							{
								group01.push(item);
							}
							else
							{
								groupOne.push(item);
							}
						}
						else if ( item.length == 2 )
						{
							if ( item[0].value == value )
							{
								group01.push(item);
							}
							else
							{
								groupTwo.push(item);
							}
						}
						else if ( item.length == 3 )
						{
							if ( item[0].sValue == 52 || item[0].sValue === 53 )
							{
								return false;
							}
							if ( item[0].value == value )
							{
								group01.push(item);
							}
							else
							{
								groupThree.push(item);
							}
						}
						else if ( item.length == 4 )
						{
							if ( item[0].value != laizi.laizi.value )
							{
								return false;
							}
							groupFour.push(item);
						}
					}
					cc.log("groupthree.elngth = "+groupThree.length);
					var lNum = laizi.count;
					if ( lNum == 1 )
					{
						cc.log("groupthree.elngth = "+groupThree.length);
						//飞机带牌
						if ( groupThree.length == 1 )
						{
							if ( groupTwo.length < 1 ){return false;}
							var mmArr = [];
							for ( var k = 0; k < groupTwo.length; k++ )
							{
								var m = Math.abs(groupTwo[k][0].value - groupThree[0][0].value);
								mmArr.push(m);
							}
							var min = Math.min.apply(this,mmArr);
							var index = mmArr.indexOf(min);
							var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
							groupThree = this.arrayConcatArray(groupThree, mm);
							groupTwo.splice(index, 1);
						}
						else if ( groupThree.length == 2 )
						{
							if (data.length >= 12 )
							{
								if ( groupTwo.length < 1 ){return false;}
								var nnArr = [];
								for ( var i = 0; i < groupThree.length; i++ )
								{
									nnArr.push(groupThree[i][0]);
								}
								var mmArr = [];
								var index = 0;
								for ( var k = 0; k < groupTwo.length; k++ )
								{
									var te = DataUtil.copyJson(nnArr);
									te.push(groupTwo[k][0]);
									if ( this.isStraight(te) )
									{
										index = k;
										break;
									}
								}
								var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupTwo.splice(index, 1);
							}
							else if (data.length == 10 )
							{
								//飞机带两对
								var mm = [this.arrayConcatArray(groupOne[0],groupOne[0][0])];
								groupTwo = this.arrayConcatArray(groupTwo, mm);
								groupOne.splice(0);
							}
							else if ( data.length == 8 )
							{
								groupOne.push([group01[0][0]]);
							}
						}
						else if ( groupThree.length == 3 )
						{
							if ( data.length >= 15 )
							{
								if ( groupTwo.length < 1 ){return false;}
								var nnArr = [];
								for ( var i = 0; i < groupThree.length; i++ )
								{
									nnArr.push(groupThree[i][0]);
								}
								var mmArr = [];
								var index = 0;
								for ( var k = 0; k < groupTwo.length; k++ )
								{
									var te = DataUtil.copyJson(nnArr);
									te.push(groupTwo[k][0]);
									if ( this.isStraight(te) )
									{
										index = k;
										break;
									}
								}
								var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupTwo.splice(index, 1);
							}
							else if ( data.length == 12 )
							{
								groupOne = group01;
							}

						}
					}
					else if ( lNum == 2 )
					{

						if ( groupThree.length == 0 )
						{
							if ( groupTwo.length < 2 )
							{
								return false;
							}
							else
							{
								var mm = [this.arrayConcatArray(groupTwo[0], groupTwo[0][0])];
								var nn = [this.arrayConcatArray(groupTwo[1], groupTwo[1][0])];
								groupThree = this.arrayConcatArray(mm,nn);
							}
							groupTwo.splice(0, 2);
						}
						else if ( groupThree.length == 1 )
						{
							if ( data.length == 8 )
							{
								if ( groupTwo.length > 0 )
								{
									var mmArr = [];
									for ( var k = 0; k < groupTwo.length; k++ )
									{
										var m = Math.abs(groupTwo[k][0].value - groupThree[0][0].value);
										mmArr.push(m);
									}
									var min = Math.min.apply(this,mmArr);
									var index = mmArr.indexOf(min);
									var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupTwo.splice(index, 1);
									groupOne.push(group01[0][0]);
								}
								else
								{
									var mmArr = [];
									for ( var k = 0; k < groupOne.length; k++ )
									{
										var m = Math.abs(groupOne[k][0].value - groupThree[0][0].value);
										mmArr.push(m);
									}
									var min = Math.min.apply(this,mmArr);
									var index = mmArr.indexOf(min);
									var mm = [this.arrayConcatArray(groupOne[index], groupOne[index][0],groupOne[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.splice(index, 1);
								}
							}
							else if ( data.length == 10 )
							{
								if ( groupTwo.length < 2 ){return false;}
								var mm = [this.arrayConcatArray(groupOne[0], groupOne[0][0], groupOne[0][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupOne.splice(0, 1);
							}
						}
						else if ( groupThree.length == 2 )
						{
							if ( data.length == 8 )
							{
								if ( groupTwo.length == 0 && groupOne.length == 0)
								{
									groupTwo = group01;
								}
							}
							else if ( data.length == 9 )
							{
								//飞机不带
								var mm = [this.arrayConcatArray(groupOne[0], groupOne[0][0], groupOne[0][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupOne.splice(0);
							}
							else if (data.length == 10 )
							{
								//飞机带两对
								if ( groupTwo.length > 0 )
								{
									groupTwo.push(group01[0]);
								}
								else
								{
									groupOne = [[groupOne[0][0],groupOne[0][0]],[groupOne[1][0],groupOne[1][0]]];
									groupOne.splice(0);
								}
							}
							else if (data.length == 12 )
							{
								if ( groupTwo.length == 0 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupOne.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupOne[k][0]);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									var mm = [this.arrayConcatArray(groupOne[index], groupOne[index][0],groupOne[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.splice(index, 1);
								}
								else if ( groupTwo.length == 1 )
								{
									var mm = [this.arrayConcatArray(groupTwo[0], groupTwo[0][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.push([group01[0][0]]);
									groupTwo.splice(0);
								}
								else if ( groupTwo.length == 2 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupTwo.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupTwo[k][0]);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupTwo.splice(index, 1);
									groupOne.push([group01[0][0]]);
								}


							}
						}
						else if ( groupThree.length == 3 )
						{
							cc.log("-----------------------------------------");
							if ( data.length == 12 )
							{
								groupTwo = group01;
							}
							else if ( data.length == 16 )
							{
								if ( groupTwo.length == 0 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupOne.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupOne[k][0]);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									var mm = [this.arrayConcatArray(groupOne[index], groupOne[index][0],groupOne[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.splice(index, 1);
								}
								else if ( groupTwo.length == 1 )
								{
									var mm = [this.arrayConcatArray(groupTwo[0], groupTwo[0][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.push([group01[0][0]]);
									groupTwo.splice(0);
								}
								else if ( groupTwo.length == 2 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupTwo.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupTwo[k][0]);
										cc.log(groupTwo[k][0].value);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									cc.log("TWO= "+JSON.stringify(groupTwo)+"  "+index);
									var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupTwo.splice(index, 1);
									groupOne.push([group01[0][0]]);
								}
							}
							else if ( data.length == 15 )//飞机带对子
							{
								if ( groupTwo.length == 0 )
								{
									return false;
								}
								else if ( groupTwo.length == 1 )
								{
									groupOne[0].push(groupOne[0][0]);
									groupOne[1].push(groupOne[1][0]);
									groupTwo = this.arrayConcatArray(groupTwo, groupOne);
									groupOne.splice(0);
								}
								else if ( groupTwo.length == 2 )
								{
									groupTwo = this.arrayConcatArray(groupTwo, group01);
								}
							}

						}
					}
					else if ( lNum == 3 )
					{
						cc.log("-----------------------------------------");
						if ( groupThree.length == 0 )
						{
							if ( groupTwo.length == 0 )
							{
								return false;
							}
							else if ( groupTwo.length == 1 )
							{
								groupTwo[0].push(groupTwo[0][0]);
								var tArr = [];
								for ( var i = 0; i < groupOne.length; i++ )
								{
									var va = Math.abs(groupOne[i][0].value - groupTwo[0][0].value);
									tArr.push(va);
								}
								var min = Math.min.apply(this, tArr);
								var index = tArr.indexOf(min);
								var oneTemp = DataUtil.copyJson(groupOne);
								var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
								groupThree = this.arrayConcatArray(mm, groupTwo);
								groupTwo.splice(0);
								groupOne.splice(index, 1);
							}
							else if ( groupTwo.length == 2 )
							{
								if ( Math.abs(groupTwo[0][0].value - groupTwo[1][0].value) == 1 )
								{
									groupTwo[0].push(groupTwo[0][0]);
									groupTwo[1].push(groupTwo[1][0]);
									mm = DataUtil.copyJson(groupTwo);
									groupThree = mm;
									groupTwo.splice(0);
									groupOne.push(group01[0][0]);
								}
								else
								{
									var tArr = [], tArr01 = [];
									for ( var i = 0; i < groupOne.length; i++ )
									{
										var va = Math.abs(groupOne[i][0].value - groupTwo[0][0].value);
										tArr.push(va);
										var va01 = Math.abs(groupOne[i][0].value - groupTwo[1][0].value);
										tArr01.push(va01);
									}
									var min = Math.min.apply(this, tArr);
									var min01 = Math.min.apply(this, tArr01);
									cc.log("min= "+min+"  min01= "+min01);
									if ( min != 1 && min01 != 1 )
									{
										return false;
									}
									else if ( min == 1 )
									{
										groupTwo[0].push(groupTwo[0][0]);
										var index = tArr.indexOf(min);
										var oneTemp = DataUtil.copyJson(groupOne);
										var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
										groupThree = this.arrayConcatArray(mm, [groupTwo[0]]);
										groupTwo.splice(0, 1);
										groupOne.splice(0);
									}
									else if ( min01 == 1 )
									{
										groupTwo[1].push(groupTwo[1][0]);
										var index = tArr01.indexOf(min01);
										var oneTemp = DataUtil.copyJson(groupOne);
										var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
										groupThree = this.arrayConcatArray(mm, [groupTwo[1]]);
										groupTwo.splice(1, 1);
										groupOne.splice(0);
									}
								}
							}
						}
						else if ( groupThree.length == 1 )
						{
							cc.log("---------hehehehhee----------");
							if ( groupTwo.length == 0 )
							{
								if ( Math.abs(groupThree[0][0].value - group01[0][0].value) == 1 )
								{
									groupThree = this.arrayConcatArray(groupThree, group01);
								}
								else
								{
									var tArr = [] ;
									for ( var i = 0; i < groupOne.length; i++ )
									{
										var va = Math.abs(groupOne[i][0].value - groupThree[0][0].value);
										tArr.push(va);
									}
									var min = Math.min.apply(this, tArr);
									if ( min != 1 )
									{
										return false;
									}
									else
									{
										var index = tArr.indexOf(min);
										var oneTemp = DataUtil.copyJson(groupOne);
										var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
										groupThree = this.arrayConcatArray(mm, [groupThree[0]]);
										groupOne.splice(index,1,group01[0][0]);
									}
								}
							}
							if ( groupTwo.length == 1 )
							{
								if ( data.length == 8 )
								{
									return true;
								}
								else if ( data.length == 9 )
								{
									//飞机不带
									if ( groupOne[0][0].value + groupThree[0][0].value == 2*groupTwo[0][0].value)
									{
										return true;
									}
									else
									{
										return false;
									}
								}
								else if ( data.length == 10 )
								{
									if ( Math.abs(groupThree[0][0].value - groupTwo[0][0].value) == 1 )
									{
										return true;
									}
									else
									{
										var tArr = [];
										for ( var i = 0; i < groupOne.length; i++ )
										{
											var va = Math.abs(groupOne[i][0].value - groupThree[0][0].value);
											tArr.push(va);
										}
										var min = Math.min.apply(this, tArr);
										if ( min != 1 )
										{
											return false;
										}
										else
										{
											return true;
										}
									}
								}
								else if ( data.length == 12 )
								{
									if ( Math.abs(groupThree[0][0].value - groupTwo[0][0].value) != 1 )
									{
										return false;
									}
									else
									{
										var tArr = [], tArr01 = [];
										for ( var i = 0; i < groupOne.length; i++ )
										{
											var va = Math.abs(groupOne[i][0].value - groupTwo[0][0].value);
											tArr.push(va);
											var va01 = Math.abs(groupOne[i][0].value - groupThree[0][0].value);
											tArr01.push(va01);
										}
										var min = Math.min.apply(this, tArr);
										var min01 = Math.min.apply(this, tArr01);
										if ( min != 1 && min01 != 1 )
										{
											return false;
										}
										else
										{
											return true;
										}
									}
								}
							}
							else if ( groupTwo.length == 2 )
							{
								if ( data.length == 10 )
								{
									//三带一对
									return true;
								}
								else if ( data.length == 12 )
								{
									var v0 = groupTwo[0][0].value;
									var v1 = groupTwo[1][0].value;
									var v2 = groupThree[0][0].value;
									var arr = [v0, v1, v2];
									arr.sort(function(a,b){return a-b});
									if ( arr[0] + arr[2] == 2*arr[1] )
									{
										return true;
									}
									else
									{
										return false;
									}
								}
							}
							else if ( groupTwo.length == 3 )
							{
								//TODO
							}
						}
						else if ( groupThree.length == 2 )
						{
							if ( groupTwo.length == 0 )
							{
								if ( data.length == 12 )
								{
									if ( Math.abs(groupThree[0][0].value - groupThree[1][0].value) == 1 )
									{
										return true;
									}

								}
							}
						}
						else
						{
							groupThree = group01;
						}
						cc.log("-----------------------------------------three "+JSON.stringify(groupThree));
						cc.log("-----------------------------------------one "+JSON.stringify(groupOne));
						cc.log("-----------------------------------------two "+JSON.stringify(groupTwo));
					}
					else if ( lNum == 4 )
					{
						groupThree = group01[0].slice(0, 3);
					}
				}
				else
				{
					var groupOne = [], groupTwo = [], groupThree = [];
					for ( var i = 0; i < groupArray.length; i++ )
					{
						var item = groupArray[i];
						if ( item.length == 1 )
						{
							groupOne.push(item);
						}
						else if ( item.length == 2 )
						{
							groupTwo.push(item);
						}
						else if ( item.length == 3 )
						{
							if ( item[0].sValue == 52 || item[0].sValue === 53 )
							{
								return false;
							}
							groupThree.push(item);
						}
					}
				}
				if ( groupThree.length < 2 ){return false;}
				//顺序排序
				groupThree = groupThree.sort(function(a,b)
				{
					return a[0].value - b[0].value;
				});
				if ( groupThree.length == 2 )
				{
					var value = Math.abs(groupThree[0][0].value - groupThree[1][0].value);
					if ( value != 1 ){return false;}
					if ( data.length == 6 )
					{
						//飞机不带
						return true;
					}
					//飞机带两对，飞机带两单，飞机带一对
					if ( (groupTwo.length == 2 && groupOne.length == 0) ||
						(groupTwo.length == 0 && groupOne.length == 2) ||
						(groupTwo.length == 1 && groupOne.length == 0))
					{
						return true;
					}
				}
				else if ( groupThree.length == 3 )
				{
					var temp = groupThree;
					var a = groupThree[0][0].value + groupThree[2][0].value;
					var b = 2*groupThree[1][0].value;
					if ( a == b )
					{
						if ( data.length == 9 )
						{
							//飞机不带
							return true;
						}
					}
					else
					{
						return false;
					}
					//飞机带三对，飞机带三单，飞机带一对一单
					if ( (groupTwo.length == 3 && groupOne.length == 0) ||
						(groupTwo.length == 0 && groupOne.length == 3) ||
						(groupTwo.length == 1 && groupOne.length == 1))
					{
						return true;
					}
				}
				else if ( groupThree.length == 4 )
				{
					var id1 = groupThree[0][0].value;
					var id2 = groupThree[1][0].value;
					var id3 = groupThree[2][0].value;
					var id4 = groupThree[3][0].value;
					//三个数连续则为true
					if ( (id1+id3) == 2*id2 )
					{
						if ( data.length == 12 )
						{
							return true;
						}
						else if ( (id1+id3) != 2*id2 ||  (id2+id4) != 2*id3 )
						{
							return false;
						}
					}
					else if ( (id2+id4) == 2*id3 )
					{
						if ( data.length == 12 )
						{
							return true;
						}
						else if ( (id1+id3) != 2*id2 ||  (id2+id4) != 2*id3 )
						{
							return false;
						}
					}
					//飞机带四对,飞机带四单
					if ( (groupTwo.length == 4 && groupOne.length == 0) || (groupTwo.length == 0 && groupOne.length == 4) )
					{
						return true;
					}
					//四带两对
					if ( (groupTwo.length == 2 && groupOne.length == 0) )
					{
						return true;
					}
					//飞机不带
					if (groupTwo.length == 0 && groupOne.length == 0 )
					{
						return true;
					}
				}
				else if ( groupThree.length == 5 )
				{
					var id1 = groupThree[0][0].value;
					var id2 = groupThree[1][0].value;
					var id3 = groupThree[2][0].value;
					var id4 = groupThree[3][0].value;
					var id5 = groupThree[4][0].value;
					if ( (id1+id3 == 2*id2) && (id2+id4 == 2*id3) )
					{
						//id1,2,3,4连续
						//id1,2,3,4 带5,带一单
						if ( groupOne.length == 1 && groupTwo.length == 0 )
						{
							return true;
						}
						else if ( id3+id5 == 2*id4 )
						{
							//全部连续
							//飞机带5单，飞机不带，飞机带两对一单，飞机带一对三单
							if ( (groupTwo.length == 0 && groupOne.length == 5) ||
								(groupTwo.length == 0 && groupOne.length == 0) ||
								(groupTwo.length == 2 && groupOne.length == 1) ||
								(groupTwo.length == 1 && groupOne.length == 3))
							{
								return true;
							}
						}
					}
					else if ( (id2+id4 == 2*id3 && id3+id5 == 2*id4) )
					{
						//id2,3,4,5连续
						//id2,3,4,5 带1,带一单
						if ( groupOne.length == 1 && groupTwo.length == 0 )
						{
							return true;
						}
						else if ( id1 + id3 == 2*id2 )
						{
							//全部连续
							//飞机带5单，飞机不带，飞机带两对一单，飞机带一对三单
							if ((groupTwo.length == 0 && groupOne.length == 5) ||
								(groupTwo.length == 0 && groupOne.length == 0) ||
								(groupTwo.length == 2 && groupOne.length == 1) ||
								(groupTwo.length == 1 && groupOne.length == 3))
							{
								return true;
							}
						}
					}

				}
				else if ( groupThree.length == 6 )
				{
					var id1 = groupThree[0][0].value;
					var id2 = groupThree[1][0].value;
					var id3 = groupThree[2][0].value;
					var id4 = groupThree[3][0].value;
					var id5 = groupThree[4][0].value;
					var id6 = groupThree[5][0].value;
					//连续,必定为true
					if (id1+id3 == 2*id2 && id2+id4 == 2*id3 && id3+id5 == 2*id4 && id4+id6 == 2*id5)
					{
						return true;
					}
					else if ((id1+id3 == 2*id2 && id2+id4 == 2*id3 && id3+id5 == 2*id4) ||
						(id1+id3 != 2*id2 && id2+id4 == 2*id3 && id3+id5 == 2*id4))
					{
						if ( groupTwo.length == 1 && groupOne == 0 )
						{
							return true;
						}
						else if ((groupOne.length == 2 && groupTwo.length == 0 && id4+id6 != 2*id5) ||
							(groupOne.length == 0 && groupTwo.length == 1 && id4+id6 != 2*id5))
						{
							return true;
						}
					}
				}
				return false;
			},
			/**
			 * 获取飞机类型（含癞子牌的情况）
			 * @param data
			 * @returns
			 */
			getMyThreeByThree:function(data)
			{
				if ( !data || data.length < 6 ) {return false;}
				data = data.sort(function(a,b){return a.value-b.value;})
				var laizi = this.getLaiziNumber(data);//{count:count, laizi:laizi}
				//将用户的牌进行分组
				var groupArray = this.groupData(data);
				if ( laizi.count > 0 )
				{   //有癞子加入的情况
					var value = laizi.laizi.value;
					var groupOne = [], groupTwo = [], groupThree = [], groupFour = [], group01 = [];//01盛放癞子牌;
					for ( var i = 0; i < groupArray.length; i++ )
					{
						var item = groupArray[i];
						if ( item.length == 1 )
						{
							if ( item[0].value == value )
							{
								group01.push(item);
							}
							else
							{
								groupOne.push(item);
							}
						}
						else if ( item.length == 2 )
						{
							if ( item[0].value == value )
							{
								group01.push(item);
							}
							else
							{
								groupTwo.push(item);
							}
						}
						else if ( item.length == 3 )
						{
							if ( item[0].sValue == 52 || item[0].sValue === 53 )
							{
								return false;
							}
							if ( item[0].value == value )
							{
								group01.push(item);
							}
							else
							{
								groupThree.push(item);
							}
						}
						else if ( item.length == 4 )
						{
							if ( item[0].value != laizi.laizi.value )
							{
								return false;
							}
							groupFour.push(item);
						}
					}
					var lNum = laizi.count;
					if ( lNum == 1 )
					{
						//飞机带牌
						if ( groupThree.length == 1 )
						{
							if ( groupTwo.length < 1 ){return false;}
							var mmArr = [];
							for ( var k = 0; k < groupTwo.length; k++ )
							{
								var m = Math.abs(groupTwo[k][0].value - groupThree[0][0].value);
								mmArr.push(m);
							}
							var min = Math.min.apply(this,mmArr);
							var index = mmArr.indexOf(min);
							var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
							groupThree = this.arrayConcatArray(groupThree, mm);
							groupTwo.splice(index, 1);
						}
						else if ( groupThree.length == 2 )
						{
							if (data.length >= 12 )
							{
								if ( groupTwo.length < 1 ){return false;}
								var nnArr = [];
								for ( var i = 0; i < groupThree.length; i++ )
								{
									nnArr.push(groupThree[i][0]);
								}
								var mmArr = [];
								var index = 0;
								for ( var k = 0; k < groupTwo.length; k++ )
								{
									var te = DataUtil.copyJson(nnArr);
									te.push(groupTwo[k][0]);
									if ( this.isStraight(te) )
									{
										index = k;
										break;
									}
								}
								var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupTwo.splice(index, 1);
							}
							else if (data.length == 10 )
							{
								//飞机带两对
								var mm = [this.arrayConcatArray(groupOne[0],groupOne[0][0])];
								groupTwo = this.arrayConcatArray(groupTwo, mm);
								groupOne.splice(0);
							}
							else if ( data.length == 8 )
							{
								groupOne[0].push(group01[0][0]);
							}
						}
						else if ( groupThree.length == 3 )
						{
							if ( data.length >= 15 )
							{
								if ( groupTwo.length < 1 ){return false;}
								var nnArr = [];
								for ( var i = 0; i < groupThree.length; i++ )
								{
									nnArr.push(groupThree[i][0]);
								}
								var mmArr = [];
								var index = 0;
								for ( var k = 0; k < groupTwo.length; k++ )
								{
									var te = DataUtil.copyJson(nnArr);
									te.push(groupTwo[k][0]);
									if ( this.isStraight(te) )
									{
										index = k;
										break;
									}
								}
								var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupTwo.splice(index, 1);
							}
							else if ( data.length == 12 )
							{
								groupOne = group01;
							}

						}
					}
					else if ( lNum == 2 )
					{

						if ( groupThree.length == 0 )
						{
							if ( groupTwo.length < 2 )
							{
								return false;
							}
							else
							{
								var mm = [this.arrayConcatArray(groupTwo[0], groupTwo[0][0])];
								var nn = [this.arrayConcatArray(groupTwo[1], groupTwo[1][0])];
								groupThree = this.arrayConcatArray(mm,nn);
							}
							groupTwo.splice(0, 2);
						}
						else if ( groupThree.length == 1 )
						{
							if ( data.length == 8 )
							{
								if ( groupTwo.length > 0 )
								{
									var mmArr = [];
									for ( var k = 0; k < groupTwo.length; k++ )
									{
										var m = Math.abs(groupTwo[k][0].value - groupThree[0][0].value);
										mmArr.push(m);
									}
									var min = Math.min.apply(this,mmArr);
									var index = mmArr.indexOf(min);
									var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupTwo.splice(index, 1);
									groupOne.push(group01[0][0]);
								}
								else
								{
									var mmArr = [];
									for ( var k = 0; k < groupOne.length; k++ )
									{
										var m = Math.abs(groupOne[k][0].value - groupThree[0][0].value);
										mmArr.push(m);
									}
									var min = Math.min.apply(this,mmArr);
									var index = mmArr.indexOf(min);
									var mm = [this.arrayConcatArray(groupOne[index], groupOne[index][0],groupOne[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.splice(index, 1);
								}
							}
							else if ( data.length == 10 )
							{
								if ( groupTwo.length < 2 ){return false;}
								var mm = [this.arrayConcatArray(groupOne[0], groupOne[0][0], groupOne[0][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupOne.splice(0, 1);
							}
						}
						else if ( groupThree.length == 2 )
						{
							if ( data.length == 8 )
							{
								if ( groupTwo.length == 0 && groupOne.length == 0)
								{
									groupTwo = group01;
								}
							}
							else if ( data.length == 9 )
							{
								//飞机不带
								var mm = [this.arrayConcatArray(groupOne[0], groupOne[0][0], groupOne[0][0])];
								groupThree = this.arrayConcatArray(groupThree, mm);
								groupOne.splice(0);
							}
							else if (data.length == 10 )
							{
								//飞机带两对
								if ( groupTwo.length > 0 )
								{
									groupTwo.push(group01[0]);
								}
								else
								{
									groupOne = [[groupOne[0][0],groupOne[0][0]],[groupOne[1][0],groupOne[1][0]]];
									groupOne.splice(0);
								}
							}
							else if (data.length == 12 )
							{
								if ( groupTwo.length == 0 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupOne.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupOne[k][0]);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									var mm = [this.arrayConcatArray(groupOne[index], groupOne[index][0],groupOne[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.splice(index, 1);
								}
								else if ( groupTwo.length == 1 )
								{
									var mm = [this.arrayConcatArray(groupTwo[0], groupTwo[0][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.push([group01[0][0]]);
									groupTwo.splice(0);
								}
								else if ( groupTwo.length == 2 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupTwo.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupTwo[k][0]);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupTwo.splice(index, 1);
									groupOne.push([group01[0][0]]);
								}


							}
						}
						else if ( groupThree.length == 3 )
						{
							cc.log("-----------------------------------------");
							if ( data.length == 12 )
							{
								groupTwo = group01;
							}
							else if ( data.length == 16 )
							{
								if ( groupTwo.length == 0 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupOne.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupOne[k][0]);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									var mm = [this.arrayConcatArray(groupOne[index], groupOne[index][0],groupOne[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.splice(index, 1);
								}
								else if ( groupTwo.length == 1 )
								{
									var mm = [this.arrayConcatArray(groupTwo[0], groupTwo[0][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupOne.push([group01[0][0]]);
									groupTwo.splice(0);
								}
								else if ( groupTwo.length == 2 )
								{
									var nnArr = [];
									for ( var i = 0; i < groupThree.length; i++ )
									{
										nnArr.push(groupThree[i][0]);
									}
									var mmArr = [];
									var index = 0;
									for ( var k = 0; k < groupTwo.length; k++ )
									{
										var te = DataUtil.copyJson(nnArr);
										te.push(groupTwo[k][0]);
										cc.log(groupTwo[k][0].value);
										if ( this.isStraight(te) )
										{
											index = k;
											break;
										}
									}
									cc.log("TWO= "+JSON.stringify(groupTwo)+"  "+index);
									var mm = [this.arrayConcatArray(groupTwo[index], groupTwo[index][0])];
									groupThree = this.arrayConcatArray(groupThree, mm);
									groupTwo.splice(index, 1);
									groupOne.push([group01[0][0]]);
								}
							}
							else if ( data.length == 15 )//飞机带对子
							{
								if ( groupTwo.length == 0 )
								{
									return false;
								}
								else if ( groupTwo.length == 1 )
								{
									groupOne[0].push(groupOne[0][0]);
									groupOne[1].push(groupOne[1][0]);
									groupTwo = this.arrayConcatArray(groupTwo, groupOne);
									groupOne.splice(0);
								}
								else if ( groupTwo.length == 2 )
								{
									groupTwo = this.arrayConcatArray(groupTwo, group01);
								}
							}

						}
					}
					else if ( lNum == 3 )
					{
						if ( groupThree.length == 0 )
						{
							if ( groupTwo.length == 0 )
							{
								return false;
							}
							else if ( groupTwo.length == 1 )
							{
								groupTwo[0].push(groupTwo[0][0]);
								var tArr = [];
								for ( var i = 0; i < groupOne.length; i++ )
								{
									var va = Math.abs(groupOne[i][0].value - groupTwo[0][0].value);
									tArr.push(va);
								}
								var min = Math.min.apply(this, tArr);
								var index = tArr.indexOf(min);
								var oneTemp = DataUtil.copyJson(groupOne);
								var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
								groupThree = this.arrayConcatArray(mm, groupTwo);
								groupTwo.splice(0);
								groupOne.splice(index, 1);
							}
							else if ( groupTwo.length == 2 )
							{
								if ( Math.abs(groupTwo[0][0].value - groupTwo[1][0].value) == 1 )
								{
									groupTwo[0].push(groupTwo[0][0]);
									groupTwo[1].push(groupTwo[1][0]);
									mm = DataUtil.copyJson(groupTwo);
									groupThree = mm;
									groupTwo.splice(0);
									groupOne.push(group01[0][0]);
								}
								else
								{
									var tArr = [], tArr01 = [];
									for ( var i = 0; i < groupOne.length; i++ )
									{
										var va = Math.abs(groupOne[i][0].value - groupTwo[0][0].value);
										tArr.push(va);
										var va01 = Math.abs(groupOne[i][0].value - groupTwo[1][0].value);
										tArr01.push(va01);
									}
									var min = Math.min.apply(this, tArr);
									var min01 = Math.min.apply(this, tArr01);
									cc.log("min= "+min+"  min01= "+min01);
									if ( min != 1 && min01 != 1 )
									{
										return false;
									}
									else if ( min == 1 )
									{
										groupTwo[0].push(groupTwo[0][0]);
										var index = tArr.indexOf(min);
										var oneTemp = DataUtil.copyJson(groupOne);
										var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
										groupThree = this.arrayConcatArray(mm, [groupTwo[0]]);
										groupTwo.splice(0, 1);
										groupOne.splice(0);
									}
									else if ( min01 == 1 )
									{
										groupTwo[1].push(groupTwo[1][0]);
										var index = tArr01.indexOf(min01);
										var oneTemp = DataUtil.copyJson(groupOne);
										var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
										groupThree = this.arrayConcatArray(mm, [groupTwo[1]]);
										groupTwo.splice(1, 1);
										groupOne.splice(0);
									}
								}
							}
						}
						else if ( groupThree.length == 1 )
						{
							cc.log("---------hehehehhee----------");
							if ( groupTwo.length == 0 )
							{
								if ( Math.abs(groupThree[0][0].value - group01[0][0].value) == 1 )
								{
									groupThree = this.arrayConcatArray(groupThree, group01);
								}
								else
								{
									var tArr = [] ;
									for ( var i = 0; i < groupOne.length; i++ )
									{
										var va = Math.abs(groupOne[i][0].value - groupThree[0][0].value);
										tArr.push(va);
									}
									var min = Math.min.apply(this, tArr);
									if ( min != 1 )
									{
										return false;
									}
									else
									{
										var index = tArr.indexOf(min);
										var oneTemp = DataUtil.copyJson(groupOne);
										var mm = [this.arrayConcatArray(oneTemp[index],oneTemp[index][0],oneTemp[index][0])];
										groupThree = this.arrayConcatArray(mm, [groupThree[0]]);
										groupOne.splice(index,1,group01[0][0]);
									}
								}
							}
							if ( groupTwo.length == 1 )
							{
								if ( data.length == 8 )
								{
									return true;
								}
								else if ( data.length == 9 )
								{
									//飞机不带
									if ( groupOne[0][0].value + groupThree[0][0].value == 2*groupTwo[0][0].value)
									{
										return true;
									}
									else
									{
										return false;
									}
								}
								else if ( data.length == 10 )
								{
									if ( Math.abs(groupThree[0][0].value - groupTwo[0][0].value) == 1 )
									{
										return true;
									}
									else
									{
										var tArr = [];
										for ( var i = 0; i < groupOne.length; i++ )
										{
											var va = Math.abs(groupOne[i][0].value - groupThree[0][0].value);
											tArr.push(va);
										}
										var min = Math.min.apply(this, tArr);
										if ( min != 1 )
										{
											return false;
										}
										else
										{
											return true;
										}
									}
								}
								else if ( data.length == 12 )
								{
									if ( Math.abs(groupThree[0][0].value - groupTwo[0][0].value) != 1 )
									{
										return false;
									}
									else
									{
										var tArr = [], tArr01 = [];
										for ( var i = 0; i < groupOne.length; i++ )
										{
											var va = Math.abs(groupOne[i][0].value - groupTwo[0][0].value);
											tArr.push(va);
											var va01 = Math.abs(groupOne[i][0].value - groupThree[0][0].value);
											tArr01.push(va01);
										}
										var min = Math.min.apply(this, tArr);
										var min01 = Math.min.apply(this, tArr01);
										if ( min != 1 && min01 != 1 )
										{
											return false;
										}
										else
										{
											return true;
										}
									}
								}
							}
							else if ( groupTwo.length == 2 )
							{
								if ( data.length == 10 )
								{
									//三带一对
									return true;
								}
								else if ( data.length == 12 )
								{
									var v0 = groupTwo[0][0].value;
									var v1 = groupTwo[1][0].value;
									var v2 = groupThree[0][0].value;
									var arr = [v0, v1, v2];
									arr.sort(function(a,b){return a-b});
									if ( arr[0] + arr[2] == 2*arr[1] )
									{
										return true;
									}
									else
									{
										return false;
									}
								}
							}
							else if ( groupTwo.length == 3 )
							{
								//TODO
							}
						}
						else if ( groupThree.length == 2 )
						{
							if ( groupTwo.length == 0 )
							{
								if ( data.length == 12 )
								{
									if ( Math.abs(groupThree[0][0].value - groupThree[1][0].value) == 1 )
									{
										return true;
									}

								}
							}
						}
						else
						{
							groupThree = group01;
						}
					}
					else if ( lNum == 4 )
					{
						groupThree = group01[0].slice(0, 3);
					}
				}
				cc.log("-----------------------------------------three "+JSON.stringify(groupThree));
				cc.log("-----------------------------------------one "+JSON.stringify(groupOne));
				cc.log("-----------------------------------------two "+JSON.stringify(groupTwo));
				cc.log("groupZfs==================");
				var groupZfs = [];
				for ( var i = 0; i < groupThree.length; i++ )
				{
					for ( var j = 0; j < groupThree[i].length; j++ )
					{
						groupZfs.push(groupThree[i][j]);
					}
				}
				for ( var i = 0; i < groupTwo.length; i++ )
				{
					for ( var j = 0; j < groupTwo[i].length; j++ )
					{
						groupZfs.push(groupTwo[i][j]);
					}
				}
				for ( var i = 0; i < groupOne.length; i++ )
				{
					for ( var j = 0; j < groupOne[i].length; j++ )
					{
						groupZfs.push(groupOne[i][j]);
					}
				}
				cc.log(JSON.stringify(groupZfs));
				return groupZfs;
			},
			/**
			 * 获取任意玩家牌中存在的，所有类型的扑克
			 * @returns{array}
			 */
			getRandomPuker:function(intelligentData)
			{
				var data = [];
				var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
				if ( intelligentData )
				{
					//智能提示
					currentPuker = intelligentData;
				}
				for (var m = 0; m < currentPuker.length; m++) {
					data.push (currentPuker[m].sortNumber);
				}
				data = this.getPukerData (data);

				//单牌类型
				var rData01 = [];
				var r01 = this.groupData (data);
				for (var i = 0; i < r01.length; i++) {
					if (r01[i].length == 1) {
						rData01.push (r01[i]);
					}
				}
				rData01.sort(function(a, b){return a[0].value-b[0].value});
				var s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}];
				var rData02 = this.getCardForType (data, s_data, 2, true);//对牌类型
				s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}];
				var rData03 = this.getCardForType (data, s_data, 3, true);//三条类型
				s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 1, sValue: 0}];
				var rData07 = this.getCardForType (data, s_data, 7, true);//三带一单
				s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}, {value : 1, sValue: 0}, {value: 1, sValue: 0}];
				var rData08 = this.getCardForType (data, s_data, 8, true);//三带一对
				s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}, {value : 0,sValue: 0}, {value: 1, sValue: 0}, {value: -1, sValue: 0}];
				var rData09 = this.getCardForType (data, s_data, 9, true);//四带两单
				var rData010 = this.getCardForType (data, s_data, 10, true);//四带两对

				s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}, {value : 0, sValue: 0}, {value: 0, sValue: 0}];
				var rData04 = this.getCardForType (data, s_data, 4, true);//单连类型（顺子）

				s_data = [{value: -1, sValue: 0}, {value: -1, sValue: 0}, {value: 0, sValue: 0}, {value : 0, sValue: 0}, {value: 1, sValue: 0}, {value: 1, sValue: 0}];
				var rData05 = this.getCardForType (data, s_data, 5, true);//对连类型（连对）

				s_data = [{value:-1,sValue:0},{value:-1,sValue:0},{value:-1,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
				var rData06 = this.getCardForType(data, s_data, 6, true);//三连类型（飞机）
				s_data = [{value:-1,sValue:0},{value:-1,sValue:0},{value:-1,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0},{value:1,sValue:0}];
				var rData006 = this.getCardForType(data, s_data, 6, true);//三连类型（飞机）
				s_data = [{value:-1,sValue:0},{value:-1,sValue:0},{value:-1,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0},{value:1,sValue:0},{value:-2,sValue:0},{value:-2,sValue:0}];
				var rData0006 = this.getCardForType(data, s_data, 6, true);//三连类型（飞机）

				s_data = [{value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}, {value: 0, sValue: 0}];
				var rData011 = this.getCardForType (data, s_data, 11, true);//炸弹类型

				var temp = [];
				if (rData01.length > 0) {
					temp.push (rData01.slice (0, 1));
				}
				if (rData02.length > 0) {
					temp.push (rData02.slice (0, 1));
				}
				if (rData03.length > 0) {
					temp.push (rData03.slice (0, 1));
				}
				if (rData04.length > 0) {
					temp.push (rData04.slice (0, 1));
				}
				if (rData05.length > 0) {
					temp.push (rData05.slice (0, 1));
				}
				if (rData06.length > 0) {
					temp.push (rData06.slice (0, 1));
				}
				if ( rData006.length > 0 )
				{
					temp.push(rData006.slice(0, 1));
					lm.log("rData006.slice(0, 1).length= "+rData006.slice(0, 1)[0].length);
				}
				if ( rData0006.length > 0 )
				{
					temp.push(rData0006.slice(0, 1));
					lm.log("rData0006.slice(0, 1).length= "+rData0006.slice(0, 1)[0].length);
				}
				if (rData07.length > 0) {
					temp.push (rData07.slice (0, 1));
				}
				if (rData08.length > 0) {
					temp.push (rData08.slice (0, 1));
				}
				if (rData09.length > 0) {
					temp.push (rData09.slice (0, 1));
				}
				if (rData010.length > 0) {
					temp.push (rData010.slice (0, 1));
				}
				if (rData011.length > 0) {
					temp.push (rData011.slice (0, 1));
				}
				return temp;
			},
				 /**
				  * 判断当前选择的牌是否可出（大于上家为可出，否则不能出） 
				  * @param data 
				  * @param s_data
				  * @param type 牌的类型
				  * @param type_select 牌的类型(炸弹）
				  * @returns {boolean}
				  */
				 jugementData:function(data, s_data, type, type_select)
				 {
					 data = this.getPukerData(data);//{value:1-13,sValue:1-53}
					 s_data = this.getPukerData(s_data);//{value:1-13,sValue:1-53}

					 if ( type_select == CT_BOME_CARD )
					 {
						 if ( type != type_select )
						 {
							 return true;
						 }
					 }

					 switch (type) 
					 {
					 case 1://单牌类型
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 2://对牌类型
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 3://三条类型
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 4://单连类型（顺子）
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 5://对连类型（连对）
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 6://三连类型（飞机）
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 7://三带一单
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 8://三带一对
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 9: //四带两单
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 10://四带两对
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }
					 case 11://炸弹类型
					 {
						 return this.getJugementResult01(data, s_data, type);
					 }

					 default:
						 break;

					 }
				 },
				 getJugementResult01:function(data, s_data, type)
				 {
					 if ( type == 3 || type == 6 || type == 7 || type == 8 )
					 {
						 var group01 = this.groupData(data);
						 var group02 = this.groupData(s_data);
						 cc.log("group01============ "+JSON.stringify(group01));
						 cc.log("group02============ "+JSON.stringify(group02));
						 group01.sort(function(a, b){return -a.length + b.length;});
						 group02.sort(function(a, b){return -a.length + b.length;});
						 var temp01 = group01[0];
						 var temp02 = group02[0];
						 for ( var i = 0; i < group01.length; i++ )
						 {
							 var item = group01[i];
							 if ( item.length == 3 )
							 {
								 temp01 = item;
								 break;
							 }
						 }
						 for ( var i = 0; i < group02.length; i++ )
						 {
							 var item = group02[i];
							 if ( item.length == 3 )
							 {
								 temp02 = item;
								 break;
							 }
						 }
						 cc.log(temp01[0].value+"   021= "+temp02[0].value);
						 if ( temp01[0].value > temp02[0].value )
						 {
							 return true;
						 }
					 }
					 else if ( type == 9 || type == 10 )
					 {
						 var group01 = this.groupData(data);
						 var group02 = this.groupData(s_data);
						 group01.sort(function(a, b){return -a.length + b.length;});
						 group02.sort(function(a, b){return -a.length + b.length;});
						 var temp01 = group01[0];
						 var temp02 = group02[0];
						 for ( var i = 0; i < group01.length; i++ )
						 {
							 var item = group01[i];
							 if ( item.length == 4 )
							 {
								 temp01 = item;
								 break;
							 }
						 }
						 for ( var i = 0; i < group02.length; i++ )
						 {
							 var item = group02[i];
							 if ( item.length == 4 )
							 {
								 temp02 = item;
								 break;
							 }
						 }
						 if ( temp01[0].value > temp02[0].value )
						 {
							 return true;
						 }
					 }
					 else
					 {
						 if (type == CT_BOME_CARD)
						 {
							 data.sort(function(a, b){return a.laiziNum - b.laiziNum;});
							 s_data.sort(function(a, b){return a.laiziNum - b.laiziNum;});
							 lm.log("type=========CT_BOME_CARD "+JSON.stringify(data));
							 lm.log("type=========CT_BOME_CARD "+JSON.stringify(s_data));
						 }
						 else
						 {
							 data.sort(function(a, b){return a.value - b.value;});
							 s_data.sort(function(a, b){return a.value - b.value;});
						 }
						 if( data[0].value > s_data[0].value )
						 {
							 return true;
						 }
						 else
						 {
							 return false;
						 }
					 }
					 return false; 
				 },
				 arrayConcatArray:function()
				 {
					 var arr = arguments;
					 if (arr.length < 2){return;}
					 //类型转换
					 for ( var i = 0; i < arr.length; i++ )
					 {
						 var bool = arr[i] instanceof(Array);
						 if ( !bool )
						 {
							 arr[i] = [arr[i]];
						 }
					 }
					 if ( arr[1] )
					 {
						 Array.prototype.push.apply(arr[0], arr[1]);
					 }
					 if ( arr[2] )
					 {
						 Array.prototype.push.apply(arr[0], arr[2]);
					 }
					 if ( arr[3] )
					 {
						 Array.prototype.push.apply(arr[0], arr[3]);
					 }
					 if ( arr[4] )
					 {
						 Array.prototype.push.apply(arr[0], arr[4]);
					 }
					 if ( arr[5] )
					 {
						 Array.prototype.push.apply(arr[0], arr[5]);
					 }
					 if ( arr[6] )
					 {
						 Array.prototype.push.apply(arr[0], arr[6]);
					 }
					 if ( arr[7] )
					 {
						 Array.prototype.push.apply(arr[0], arr[7]);
					 }
					 if ( arr[8] )
					 {
						 Array.prototype.push.apply(arr[0], arr[8]);
					 }
					 return arr[0];
				 },
				 /**
				  * 癞子对牌处理
				  * @param data{array}
				  * return {array}
				  */
				 changeLaiziDouble:function(data)
				 {
					 data.sort(function(a, b){return a.laiziNum - b.laiziNum});
					 var rData = [data[0].sortNumber, data[0].sortNumber];
					 return rData;
				 },
				 /**
				  * 癞子三张处理
				  * @param data{array}
				  * @param lNum {number}
				  * return {array}
				  */
				 changeLaiziThree:function(data,lNum)
				 {
					 if (!data)
					 {
						 return [];
					 }
					 data.sort(function(a, b){return a.laiziNum - b.laiziNum});
					 if ( lNum == 2 )
					 {
						 var rData = [data[0].sortNumber, data[0].sortNumber, data[0].sortNumber];
					 }
					 else if ( lNum == 1 )
					 {
						 var rData = [data[0].sortNumber, data[1].sortNumber, data[0].sortNumber];
					 }
					 return rData;
				 },
				 /**
				  * 癞子四张处理
				  * @param data{array}
				  * @param lNum {number}
				  * return {array}
				  */
				 changeLaiziFour:function(data,lNum)
				 {
					 data.sort(function(a, b){return a.laiziNum - b.laiziNum});
					 var rData = [];
					 if ( lNum == 1 )
					 {
						 rData = [data[0].sortNumber, data[1].sortNumber, data[2].sortNumber, data[0].sortNumber];
					 }
					 else if ( lNum == 2 )
					 {
						 rData = [data[0].sortNumber, data[1].sortNumber, data[0].sortNumber, data[0].sortNumber];
					 }
					 else if ( lNum == 3 )
					 {
						 rData = [data[0].sortNumber, data[0].sortNumber, data[0].sortNumber, data[0].sortNumber];
					 }
					 return rData;
				 },
				 /**
				  * 
				  * @param temp01 {Array}
				  * @returns {Array}
				  */
				 handleOutPuker:function(temp01)
				 {
					 var s_data = sparrowDirector.gameData.oTherPuker;//上家出牌数据
					 var type = gameLogic.getType (temp01);
					 if ( type == CT_MISSILE_CARD )
					 {
						 return [temp01];
					 }
					 if (s_data.length > 0 && type != CT_BOME_CARD )
					 {
						 type = gameLogic.getType(s_data);
					 }
					 var resultLaiziData = [[]];
					 switch (type) 
					 {
					 case 1:
					 {
						 resultLaiziData = [temp01];
						 break;
					 }
					 case 2://对子
					 {
						 //1,查看所选牌中是否有癞子
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:""}];
						 var laizi= gameLogic.getLaiziNumber(data);
						 if ( laizi.count > 0 )
						 {
							 //有癞子
							 if ( laizi.count == 1 )
							 {
								 resultLaiziData = [gameLogic.changeLaiziDouble(data)];
							 }
							 else
							 {
								 resultLaiziData = [temp01];
							 }
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }

						 break;
					 }
					 case 3://三不带
					 {
						 //1,查看所选牌中是否有癞子
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 var laizi= gameLogic.getLaiziNumber(data);
						 if ( laizi.count > 0 )
						 {
							 //有癞子
							 if ( laizi.count < 3 )
							 {
								 resultLaiziData = [gameLogic.changeLaiziThree(data,laizi.count)];
							 }
							 else
							 {
								 resultLaiziData = [temp01];
							 }
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 4://顺子
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 var laizi= gameLogic.getLaiziNumber(data);
						 s_data = []; //this.getPukerData(s_data);
						 var temp02 = [];
						 if ( laizi.count > 0 )
						 {
							 var rArr = [], arr = [], num = 0;
							 for ( var i = 0; i < data.length; i++ )
							 {
								 //将非癞子牌塞选出来
								 if ( data[i].value != laizi.laizi.value )
								 {
									 rArr.push(data[i]);
									 temp02.push(data[i].sortNumber);
								 }
							 }
							 //找到空缺位置 and value
							 rArr.sort(function(a,b){return a.value - b.value;});
							 for ( var j = 1; j < rArr.length; j++ )
							 {
								 var value = rArr[j].value - rArr[j-1].value;
								 if ( Math.abs(value) != 1 )
								 {
									 num++
									 var obj = {va:(Math.abs(value) - 1),index:j}
									 arr.push(obj);
								 }
							 }
							 var temp = [];
							 cc.log("temp02= "+JSON.stringify(temp02));
							 cc.log("arr= "+JSON.stringify(arr));
							 var laiziGap = 12;
							 if ( arr.length > 0 )
							 {
								 var lCount = 0;
								 for ( var k = 0; k < arr.length; k++ )
								 {
									 //TODO
									 var kong = arr[k];
									 for ( var m = 0; m < kong.va ; m++ )
									 {
										 lCount += (m+1);
										 var mu = rArr[kong.index];//空缺位置的上一个对象
										 var val = mu.sortNumber - m -1;
										 temp.push(val);
									 }
								 }
								 if ( lCount < laizi.count )
								 {
									 var lC = laizi.count - lCount;
									 rArr.sort(function(a,b){return a.value - b.value;});
									 var max = rArr[rArr.length-1];
									 var min = rArr[0];
									 var de = lC;
									 cc.log("lcde111= "+de+" max.value+de= "+(max.value + de)+" min.value - de=== "+(min.value - de)+" max.value= "+max.value+" min.value= "+min.value);
									 if ( max.value + lC < 15 &&  min.value - lC >=3  && s_data.length < 1 )
									 {
										 //两种情况
										 var da01 = [], da02 = [];

										 if ( lC == 1 )
										 {
											 for ( var i = 0; i < lC; i++ )
											 {
												 var val01 = max.sortNumber + i + 1;
												 if ( i == de-1 && (max.value + de == 14 ) )
												 {
													 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
													 val01 = lastData.sortNumber - laiziGap;
													 cc.log("-0000000lastdata=== "+JSON.stringify(lastData));
												 }
												 da01.push(val01);
												 var val02 = min.sortNumber - i - 1;
												 da02.push(val02);
											 }
											 var te = DataUtil.copyJson(temp);
											 var dat01 = gameLogic.arrayConcatArray(da01, temp, temp02);
											 var dat02 = gameLogic.arrayConcatArray(da02, te, temp02);
											 resultLaiziData = [dat01, dat02];
											 break;
										 }
										 else if ( lC == 2 )
										 {
											 for ( var i = 0; i < lC; i++ )
											 {
												 var val01 = max.sortNumber + i + 1;
												 if ( i == de-1 && (max.value + de == 14 ) )
												 {
													 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
													 val01 = lastData.sortNumber - laiziGap;
													 cc.log("-0000000lastdata=== "+JSON.stringify(lastData));
												 }
												 da01.push(val01);
												 var val02 = min.sortNumber - i - 1;
												 da02.push(val02);
											 }
											 var da03 = [max.sortNumber+1, min.sortNumber-1];
											 var te = DataUtil.copyJson(temp);
											 var dat01 = gameLogic.arrayConcatArray(da01, temp, temp02);
											 var dat02 = gameLogic.arrayConcatArray(da02, te, temp02);
											 var dat03 = gameLogic.arrayConcatArray(da03, te, temp02);
											 resultLaiziData = [dat01, dat02, dat03];
											 break;
										 }
										 else if ( lC == 3 )
										 {
											 for ( var i = 0; i < lC; i++ )
											 {
												 var val01 = max.sortNumber + i + 1;
												 if ( i == de-1 && (max.value + de == 14 ) )
												 {
													 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
													 val01 = lastData.sortNumber - laiziGap;
													 cc.log("-0000000lastdata=== "+JSON.stringify(lastData));
												 }
												 da01.push(val01);
												 var val02 = min.sortNumber - i - 1;
												 da02.push(val02);
											 }
											 var da03 = [max.sortNumber+1, max.sortNumber+2, min.sortNumber-1];
											 var da04 = [max.sortNumber+1, min.sortNumber-2, min.sortNumber-1];
											 var te = DataUtil.copyJson(temp);
											 var dat01 = gameLogic.arrayConcatArray(da01, temp, temp02);
											 var dat02 = gameLogic.arrayConcatArray(da02, te, temp02);
											 var dat03 = gameLogic.arrayConcatArray(da03, te, temp02);
											 var dat04 = gameLogic.arrayConcatArray(da04, te, temp02);
											 resultLaiziData = [dat01, dat02, dat03, dat04];
											 break;
										 }
										 else
										 {
											 for ( var i = 0; i < lC; i++ )
											 {
												 var val01 = max.sortNumber + i + 1;
												 if ( i == de-1 && (max.value + de == 14 ) )
												 {
													 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
													 val01 = lastData.sortNumber - laiziGap;
													 cc.log("-0000000lastdata=== "+JSON.stringify(lastData));
												 }
												 da01.push(val01);
												 var val02 = min.sortNumber - i - 1;
												 da02.push(val02);
											 }
											 var te = DataUtil.copyJson(temp);
											 var dat01 = gameLogic.arrayConcatArray(da01, temp, temp02);
											 var dat02 = gameLogic.arrayConcatArray(da02, te, temp02);
											 resultLaiziData = [dat01, dat02];
											 break;
										 }

									 }
									 else if ( max.value + lC < 15 )
									 {
										 for ( var i = 0; i < lC; i++ )
										 {
											 var val = max.sortNumber + i + 1;
											 if ( i == de-1 && (max.value + de == 14 ) )
											 {
												 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
												 val01 = lastData.sortNumber - laiziGap;
												 cc.log("-0000000lastdata=== "+JSON.stringify(lastData));
											 }
											 temp.push(val);
										 }
									 }
									 else
									 {
										 for ( var i = 0; i < lC; i++ )
										 {
											 var val = min.sortNumber - i - 1;
											 temp.push(val);
										 }
									 }
								 }
							 }
							 else 
							 {
								 var de = laizi.count - arr.length;
								 rArr.sort(function(a,b){return a.value - b.value;});
								 var max = rArr[rArr.length-1];
								 var min = rArr[0];
								 cc.log("de= "+de+" max.value+de= "+(max.value + de)+" min.value - de=== "+(min.value - de));
								 if ( max.value + de < 15 &&  min.value - de >=3  && s_data.length < 1 )
								 {
									 //两种情况
									 var da01 = [], da02 = [], da03 = [];
									 if ( de == 1 )
									 {
										 for ( var i = 0; i < de; i++ )
										 {
											 var val01 = max.sortNumber + i + 1;
											 if ( i == de-1 && (max.value + de == 14 ) )
											 {
												 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
												 val01 = lastData.sortNumber - laiziGap;
												 cc.log("-lastdata=== "+JSON.stringify(lastData));
											 }

											 da01.push(val01);
											 var val02 = min.sortNumber - i - 1;
											 da02.push(val02);
										 }
										 var te = DataUtil.copyJson(temp02);
										 var dat01 = gameLogic.arrayConcatArray(da01, temp02);
										 var dat02 = gameLogic.arrayConcatArray(da02, te);
										 resultLaiziData = [dat01, dat02];
										 break;
									 }
									 else if ( de == 2 )
									 {
										 for ( var i = 0; i < de; i++ )
										 {
											 var val01 = max.sortNumber + i + 1;
											 if ( i == de-1 && (max.value + de == 14 ) )
											 {
												 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
												 val01 = lastData.sortNumber - laiziGap;
												 cc.log("-lastdata=== "+JSON.stringify(lastData));
											 }
											 da01.push(val01);
											 var val02 = min.sortNumber - i - 1;
											 da02.push(val02);
										 }
										 da03 = [max.sortNumber+1, min.sortNumber-1];
										 var te = DataUtil.copyJson(temp02);
										 var dat01 = gameLogic.arrayConcatArray(da01, temp02);
										 var dat02 = gameLogic.arrayConcatArray(da02, te);
										 var dat03 = gameLogic.arrayConcatArray(da03, te);
										 resultLaiziData = [dat01, dat02, dat03];
										 break;
									 }
									 else if ( de == 3 )
									 {
										 for ( var i = 0; i < de; i++ )
										 {
											 var val01 = max.sortNumber + i + 1;
											 if ( i == de-1 && (max.value + de == 14 ) )
											 {
												 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
												 val01 = lastData.sortNumber - laiziGap;
												 cc.log("-lastdata=== "+JSON.stringify(lastData));
											 }
											 da01.push(val01);
											 var val02 = min.sortNumber - i - 1;
											 da02.push(val02);
										 }
										 da03 = [max.sortNumber+1, max.sortNumber+2, min.sortNumber-1];
										 var da04 = [max.sortNumber+1, min.sortNumber-2, min.sortNumber-1];
										 var te = DataUtil.copyJson(temp02);
										 var dat01 = gameLogic.arrayConcatArray(da01, temp02);
										 var dat02 = gameLogic.arrayConcatArray(da02, te);
										 var dat03 = gameLogic.arrayConcatArray(da03, te);
										 var dat04 = gameLogic.arrayConcatArray(da04, te);
										 resultLaiziData = [dat01, dat02, dat03, dat04];
										 break;
									 }
									 else
									 {
										 for ( var i = 0; i < de; i++ )
										 {
											 var val01 = max.sortNumber + i + 1;
											 if ( i == de-1 && (max.value + de == 14 ) )
											 {
												 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
												 val01 = lastData.sortNumber - laiziGap;
												 cc.log("-lastdata=== "+JSON.stringify(lastData));
											 }
											 da01.push(val01);
											 var val02 = min.sortNumber - i - 1;
											 da02.push(val02);
										 }
										 var te = DataUtil.copyJson(temp02);
										 var dat01 = gameLogic.arrayConcatArray(da01, temp02);
										 var dat02 = gameLogic.arrayConcatArray(da02, te);
										 resultLaiziData = [dat01, dat02];
										 break;
									 }
								 }
								 else if ( max.value + de < 15 )
								 {
									 for ( var i = 0; i < de; i++ )
									 {
										 var val = max.sortNumber + i + 1;
										 if ( i == de-1 && (max.value + de == 14 ) )
										 {
											 var lastData = this.getPukerData([(max.sortNumber+i)])[0];
											 val01 = lastData.sortNumber - laiziGap;
											 cc.log("-lastdata=== "+JSON.stringify(lastData));
										 }
										 temp.push(val);
									 }
								 }
								 else
								 {
									 for ( var i = 0; i < de; i++ )
									 {
										 var val = min.sortNumber - i - 1;
										 temp.push(val);
									 }
								 }
							 }
							 resultLaiziData = [gameLogic.arrayConcatArray(temp, temp02)];
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 5://连对
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 var laizi= gameLogic.getLaiziNumber(data);
						 if ( laizi.count > 0 )
						 {
							 //将牌分组，找出癞子和单牌
							 var groupData = gameLogic.groupData(data);
							 lm.log("连对groupData============= "+JSON.stringify(groupData));
							 var arr01 = [], arr02 = [], arr03 = [], arr04 = [], arr05 = [], arr06 = [];
							 for ( var i = 0; i < groupData.length; i++ )
							 {
								 var item = groupData[i];
								 if ( item.length == 1 )
								 {
									 if ( item[0].value == laizi.laizi.value )
									 {
										 arr06.push(item);
									 }
									 else
									 {
										 arr01.push(item);
									 }
								 }
								 else if ( item.length == 2 )
								 {
									 if ( item[0].value == laizi.laizi.value )
									 {
										 arr05.push(item);
									 }
									 else 
									 {
										 arr02.push(item);
									 }
								 }
								 else if ( item.length == 3 )
								 {
									 arr03.push(item);
								 }
								 else if ( item.length == 4 )
								 {
									 arr04.push(item);
								 }
							 }
							 var temp = [];
							 if ( arr02.length > 0 )
							 {
								 arr02.sort(function(a, b){return a[0].value - b[0].value;});
								 var min = arr02[0][0];
								 var max = arr02[arr02.length - 1][0];
							 }
							 if( arr01.length > 0 )
							 {
								 if ( (arr06.length == arr01.length || arr01.length == laizi.count) && arr01.length != 0 )
								 {
									 var tp = [];
									 for ( var i = 0; i < arr01.length; i++ )
									 {
										 var mm = gameLogic.changeLaiziDouble(arr01[i], arr06[i]);
										 tp.push(mm);
									 }
									 if ( tp.length == 1 )
									 {
										 temp = tp[0];
									 }
									 else if ( tp.length == 2 )
									 {
										 temp = gameLogic.arrayConcatArray(tp[0], tp[1]);
									 }
									 else if ( tp.length == 3 )
									 {
										 temp = gameLogic.arrayConcatArray(tp[0], tp[1], tp[2]);
									 }
									 else
									 {
										 temp = gameLogic.arrayConcatArray(tp[0], tp[1], tp[2], tp[3]);
									 }
									 var tempR = [];
									 for ( var i = 0; i < arr02.length; i++ )
									 {
										 tempR.push(arr02[i][0].sortNumber);
										 tempR.push(arr02[i][1].sortNumber);
									 }
									 resultLaiziData = [gameLogic.arrayConcatArray(tempR, temp)];
									 break;
								 }
								 //癞子牌为1张或者三张
								 if ( arr03.length > 0 )//3张癞子
								 {
									 if ( arr01.length == 1 )//一张单牌
									 {
										 var mm = gameLogic.arrayConcatArray(arr01[0], arr03[0][0]);
										 temp = gameLogic.changeLaiziDouble(mm);
										 var gap = 1;
										 if ( arr02.length < 2 )
										 {
											 if ( mm[0].value < max.value )
											 {
												 gap = 1;
											 }
											 else 
											 {
												 gap = 2;
											 }
										 }
										 if ( max.value + 1 < 15 )
										 {
											 var val = max.sortNumber + gap;
											 temp.push(val);
											 temp.push(val);
										 }
										 else
										 {
											 var val = min.sortNumber - gap;
											 temp.push(val);
											 temp.push(val);
										 }

									 }
									 else//三张单牌
									 {
										 var mm = gameLogic.arrayConcatArray(arr01[0], arr03[0][0]);
										 var nn = gameLogic.arrayConcatArray(arr01[1], arr03[0][1]);
										 var oo = gameLogic.arrayConcatArray(arr01[2], arr03[0][2]);
										 temp = gameLogic.arrayConcatArray(gameLogic.changeLaiziDouble(mm), 
												 gameLogic.changeLaiziDouble(nn), 
												 gameLogic.changeLaiziDouble(oo)
										 );
									 }
								 }
								 if (  arr01.length == 4 )
								 {
									 var mm = gameLogic.arrayConcatArray(arr01[0], arr04[0][0]);
									 var nn = gameLogic.arrayConcatArray(arr01[1], arr04[0][1]);
									 var oo = gameLogic.arrayConcatArray(arr01[2], arr04[0][2]);
									 var pp = gameLogic.arrayConcatArray(arr01[3], arr04[0][3]);
									 temp = gameLogic.arrayConcatArray(gameLogic.changeLaiziDouble(mm), 
											 gameLogic.changeLaiziDouble(nn), 
											 gameLogic.changeLaiziDouble(oo), 
											 gameLogic.changeLaiziDouble(pp)
									 );
								 }
								 if ( arr01.length == 2 && arr05.length == 1 )
								 {
									 var mm = gameLogic.arrayConcatArray(arr01[0], arr05[0][0]);
									 var nn = gameLogic.arrayConcatArray(arr01[1], arr05[0][1]);
									 temp = gameLogic.arrayConcatArray(
										 gameLogic.changeLaiziDouble(mm),
										 gameLogic.changeLaiziDouble(nn)
									 );
								 }
							 }
							 else//没有单牌
							 {
								 if ( arr05.length == 0 && arr04.length == 0 )
								 {
									 resultLaiziData = temp01;
								 }
								 else if (laizi.count == 2)
								 {
									 var tp = [];
									 for ( var i = 0; i < arr02.length; i++ )
									 {
										 tp.push(arr02[i][0]);
									 }
									 if ( this.isStraight(tp) )
									 {
										 var de = arr05.length > 0 ? 1 : 2;
										 if ( max.value + de < 14 )
										 {
											 for ( var i = 0; i < de; i++ )
											 {
												 var val = max.sortNumber + i + 1;
												 temp.push(val);
												 temp.push(val);
											 }
										 }
										 else
										 {
											 for ( var i = 0; i < de; i++ )
											 {
												 var val = min.sortNumber - i - 1;
												 temp.push(val);
												 temp.push(val);
											 }
										 }
									 }
									 else
									 {
										 var lCount = 0,arr = [];
										 for ( var j = 1; j < tp.length; j++ )
										 {
											 var value = tp[j].value - tp[j-1].value;
											 if ( Math.abs(value) != 1 )
											 {
												 var obj = {va:(Math.abs(value) - 1),index:j}
												 arr.push(obj);
											 }
										 }
										 for ( var k = 0; k < arr.length; k++ )
										 {
											 var kong = arr[k];
											 for ( var m = 0; m < kong.va ; m++ )
											 {
												 lCount += (m+1);
												 var mu = tp[kong.index];//空缺位置的上一个对象
												 var val = mu.sortNumber - m -1;
												 temp.push(val);
												 temp.push(val);
											 }
										 }
										 var tempR = [];
										 for ( var i = 0; i < arr02.length; i++ )
										 {
											 tempR.push(arr02[i][0].sortNumber);
											 tempR.push(arr02[i][1].sortNumber);
										 }
										 resultLaiziData = [gameLogic.arrayConcatArray(tempR, temp)];
										 break;

									 }
								 }
								 else
								 {
									 var de = arr05.length > 0 ? 1 : 2;
									 if ( max.value + de < 14 )
									 {
										 for ( var i = 0; i < de; i++ )
										 {
											 var val = max.sortNumber + i + 1;
											 temp.push(val);
											 temp.push(val);
										 }
									 }
									 else
									 {
										 for ( var i = 0; i < de; i++ )
										 {
											 var val = min.sortNumber - i - 1;
											 temp.push(val);
											 temp.push(val);
										 }
									 }
								 }
							 }
							 var tempR = [];
							 for ( var i = 0; i < arr02.length; i++ )
							 {
								 tempR.push(arr02[i][0].sortNumber);
								 tempR.push(arr02[i][1].sortNumber);
							 }
							 resultLaiziData = [gameLogic.arrayConcatArray(tempR, temp)];
						 }
						 else
						 {
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 6://飞机
					 {
						 var data = gameLogic.getPukerData(temp01);
						 if ( data.length > 4 )
						 {
							 var laizi= gameLogic.getLaiziNumber(data);
							 if ( laizi.count == 0 )
							 {
								 //没有癞子
								 resultLaiziData = [temp01];
								 break;
							 }
							 else
							 {
								 var resuData = this.getMyThreeByThree(data);
								 var reArr = [];
								 for ( var i = 0; i < resuData.length; i++ )
								 {
									 reArr.push(resuData[i].sortNumber);
								 }
								 resultLaiziData = [reArr];
								 break;
							 }
						 }
						 else
						 {
							 var laizi= gameLogic.getLaiziNumber(data);
							 if ( laizi.count > 0 )
							 {
								 var temp = this.changeLaiziFour(data, laizi.count);
								 resultLaiziData = [temp];
							 }
							 else
							 {
								 //没有癞子
								 resultLaiziData = [temp01];
							 }
						 }
						 break;
					 }
					 case 7://三带一
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 s_data = this.getPukerData(s_data);
						 var laiziThree = gameLogic.getLaiZiThree(data);
						 var laizi= gameLogic.getLaiziNumber(data);
						 if ( laizi.count > 0 )
						 {
							 if ( s_data.length < 1 )
							 {
								 s_data = [{value:-2,sValue:0},{value:-2,sValue:0}];

								 var double = this.getDoubleCard(data, s_data, false, false);
								 cc.log("double.length ===== "+double.length+"  laizi.count===== "+laizi.count);
								 if ( double.length == 1 && laizi.count == 2 )
								 {
									 //选出单牌
									 var sing = function()
									 {
										 for ( var i = 0; i < data.length; i++ )
										 {
											 if ( data[i].value == laizi.laizi.value )
											 {
												 data.splice(i, 1);
												 arguments.callee();
											 }
										 }
										 return data;
									 }();
									 var da01 = [sing[0].sortNumber,sing[0].sortNumber,sing[0].sortNumber,sing[1].sortNumber];
									 var da02 = [sing[1].sortNumber,sing[1].sortNumber,sing[1].sortNumber,sing[0].sortNumber];
									 resultLaiziData = [da01, da02];
									 break;
								 }
							 }

							 //有癞子
							 if ( laizi.count < 3 )
							 {
								 resultLaiziData = gameLogic.changeLaiziThree(laiziThree[0], laizi.count);
								 var temp = function()
								 {
									 for (var i = 0; i < data.length; i++ )
									 {
										 for ( var j = 0; j < laiziThree[0].length; j++ )
										 {
											 if ( data[i].value == laiziThree[0][j].value)
											 {
												 break;
											 }
											 else if ( j == laiziThree[0].length - 1 )
											 {
												 return data[i].sortNumber;
											 }
										 }
									 }
								 }();
								 resultLaiziData = [gameLogic.arrayConcatArray(resultLaiziData, temp)];
							 }
							 else
							 {
								 resultLaiziData = [temp01];
							 }
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 8://三带一对
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 var laiziThree = gameLogic.getLaiZiThree(data);
						 s_data = this.getPukerData(s_data);
						 var myThree = this.getThreeCard(data, s_data, false, true);
						 cc.log("mythree= "+JSON.stringify(myThree))
						 var laizi= gameLogic.getLaiziNumber(data);
						 if ( laizi.count > 0 && laizi.count < 3 && laiziThree.length > 0)
						 {
							 //有癞子
							 if ( s_data.length < 1 )
							 {
								 s_data = [{value:-2,sValue:0},{value:-2,sValue:0},{value:-2,sValue:0},{value:-1,sValue:0},{value:-1,sValue:0}];

								 var double = this.getDoubleCard(data, s_data, false, false);
								 cc.log("double.length ===== "+double.length+"  laizi.count===== "+laizi.count);
								 if ( double.length == 2 && laizi.count == 1 )
								 {
									 var da01 = [double[0][0].sortNumber,double[0][0].sortNumber,double[0][1].sortNumber,double[1][0].sortNumber,double[1][1].sortNumber];
									 var da02 = [double[1][0].sortNumber,double[1][0].sortNumber,double[1][1].sortNumber,double[0][0].sortNumber,double[0][1].sortNumber];
									 resultLaiziData = [da01, da02];
									 break;
								 }
								 if ( double.length == 2 && laizi.count == 2 )
								 {
									 (function()
									 {
										 //将癞子对牌移除
										 for ( var i = 0; i < double.length; i++ )
										 {
											 if ( double[i][0].value == laizi.laizi.value )
											 {
												 double.splice(i,1);
												 break;
											 }
										 }
									 })();
									 //选出单牌
									 var sing = function()
									 {
										 for ( var i = 0; i < data.length; i++ )
										 {
											 if ( data[i].value == laizi.laizi.value || data[i].value == double[0][0].value )
											 {
												 data.splice(i, 1);
												 arguments.callee();
											 }
										 }
										 return data[0];
									 }();
									 var da01 = [sing.sortNumber,sing.sortNumber,sing.sortNumber,double[0][0].sortNumber,double[0][1].sortNumber];
									 var da02 = [sing.sortNumber,sing.sortNumber,double[0][0].sortNumber,double[0][0].sortNumber,double[0][1].sortNumber];
									 resultLaiziData = [da01, da02];
									 break;
								 }
								 if ( double.length == 0 && laizi.count == 3 )
								 {
									 var laizi_three = this.getThreeCard(data,s_data, false, true);
									 //选出单牌
									 var sing = function()
									 {
										 for ( var i = 0; i < data.length; i++ )
										 {
											 if ( data[i].value == laizi.laizi.value )
											 {
												 data.splice(i, 1);
												 arguments.callee();
											 }
										 }
										 return data;
									 }();
									 var da01 = [sing[0].sortNumber,sing[0].sortNumber,sing[0].sortNumber,laizi_three[0][0].sortNumber,laizi_three[0][1].sortNumber];
									 var da02 = [sing[1].sortNumber,sing[1].sortNumber,sing[1].sortNumber,laizi_three[0][0].sortNumber,laizi_three[0][1].sortNumber];
									 resultLaiziData = [da01, da02];
									 break;
								 }
							 }

							 var count = gameLogic.getLaiziNumber(laiziThree[0]).count;
							 resultLaiziData = gameLogic.changeLaiziThree(laiziThree[0], count);
							 var temp = function()
							 {
								 var mm = [];
								 for (var i = 0; i < data.length; i++ )
								 {
									 for ( var j = 0; j < laiziThree[0].length; j++ )
									 {
										 if ( data[i].value == laiziThree[0][j].value )
										 {
											 break;
										 }
										 else if ( j == laiziThree[0].length - 1 )
										 {
											 mm.push(data[i].sortNumber);
										 }
									 }
								 }
								 if ( count == 1 && laizi.count > 1 )
								 {
									 mm.push(laiziNum);
								 }
								 return mm;
							 }();
							 //判断对牌中是否有癞子
							 var data1 = gameLogic.getPukerData(temp);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
							 var laizi1= gameLogic.getLaiziNumber(data1);
							 if ( laizi1.count > 0 )
							 {
								 temp = gameLogic.changeLaiziDouble(data1);
							 }
							 cc.log(JSON.stringify(resultLaiziData));
							 resultLaiziData = [gameLogic.arrayConcatArray(resultLaiziData, temp)];
						 }
						 else
						 {
							 if ( myThree.length > 0)
							 {
								 var temp = function()
								 {
									 var mm = [];
									 for (var i = 0; i < data.length; i++ )
									 {
										 for ( var j = 0; j < myThree[0].length; j++ )
										 {
											 if ( data[i].value == myThree[0][j].value )
											 {
												 resultLaiziData[0].push(data[i].sortNumber);
												 break;
											 }
											 else if ( j == myThree[0].length - 1 )
											 {
												 mm.push(data[i].sortNumber);
											 }
										 }
									 }
									 return mm;
								 }();
								 var data1 = gameLogic.getPukerData(temp);
								 if ( laizi.count > 0 )
								 {
									 temp = gameLogic.changeLaiziDouble(data1);
								 }
								 else
								 {
									 temp = function()
									 {
										 var mm = [];
										 for ( var i = 0; i < data1.length; i++ )
										 {
											 mm.push(data1[i].sortNumber);
										 }
										 return mm;
									 }();
								 }
								 //没有癞子
								 resultLaiziData = [gameLogic.arrayConcatArray(resultLaiziData[0], temp)];
							 }
						 }
						 break;
					 }
					 case 9://四带两单
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 cc.log(JSON.stringify(data));
						 var laizi= gameLogic.getLaiziNumber(data);
						 var laiziFour = gameLogic.getLaiZiBoom(data);
						 if ( laizi.count > 0 && laizi.count < 4 )
						 {
							 var count = gameLogic.getLaiziNumber(laiziFour[0]).count;
							 resultLaiziData = gameLogic.changeLaiziFour(laiziFour[0], count);
							 cc.log("laizifour= "+JSON.stringify(laiziFour));
							 cc.log("laizifour= "+JSON.stringify(count));
							 var temp = function()
							 {
								 var mm = [];
								 for (var i = 0; i < data.length; i++ )
								 {
									 for ( var j = 0; j < laiziFour[0].length; j++ )
									 {
										 if ( data[i].value == laiziFour[0][j].value )
										 {
											 break;
										 }
										 else if ( j == laiziFour[0].length - 1 )
										 {
											 mm.push(data[i].sortNumber);
										 }
									 }
								 }
								 var cu = laizi.count - count;
								 cc.log("cu=  "+cu+"  laizicount= "+laizi.count+"  count= "+count);
								 for ( var k = 0; k < cu; k++ )
								 {
									 mm.push(laiziNum);
								 }
								 cc.log("mm= "+JSON.stringify(mm));
								 return mm;
							 }();
							 resultLaiziData = [gameLogic.arrayConcatArray(resultLaiziData, temp)];
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 10://四带两对
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 cc.log(JSON.stringify(data));
						 var laizi= gameLogic.getLaiziNumber(data);
						 var laiziFour = gameLogic.getLaiZiBoom(data);
						 if ( laizi.count > 0 && laizi.count < 4 )
						 {
							 var count = gameLogic.getLaiziNumber(laiziFour[0]).count;
							 resultLaiziData = gameLogic.changeLaiziFour(laiziFour[0], count);
							 cc.log("laizifour= "+JSON.stringify(laiziFour));
							 cc.log("laizifour= "+JSON.stringify(count));
							 var temp = function()
							 {
								 var mm = [];
								 for (var i = 0; i < data.length; i++ )
								 {
									 for ( var j = 0; j < laiziFour[0].length; j++ )
									 {
										 if ( data[i].value == laiziFour[0][j].value )
										 {
											 break;
										 }
										 else if ( j == laiziFour[0].length - 1 )
										 {
											 mm.push(data[i].sortNumber);
										 }
									 }
								 }
								 var cu = laizi.count - count;
								 cc.log("cu=  "+cu+"  laizicount= "+laizi.count+"  count= "+count);
								 for ( var k = 0; k < cu; k++ )
								 {
									 mm.push(laiziNum);
								 }
								 cc.log("mm= "+JSON.stringify(mm));
								 return mm;
							 }();
							 //判断对牌中是否有癞子
							 var data1 = gameLogic.getPukerData(temp);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
							 var laizi1= gameLogic.getLaiziNumber(data1);
							 if ( laizi1.count > 0 )
							 {
								 var tempp = [], m = 0;
								 for ( var i = 1; i < data1.length; i++ )
								 {
									 if ( data1[i-1].value == data1[i].value )
									 {
										 tempp = [data1[i-1], data1[i]];
										 m = i;
										 break;
									 }
								 }
								 cc.log("tepp= "+JSON.stringify(tempp));
								 tempp = gameLogic.changeLaiziDouble(tempp);
								 temp.splice(m, 1);temp.splice((m-1), 1);
								 temp = gameLogic.changeLaiziDouble(temp);
								 temp = gameLogic.arrayConcatArray(temp, tempp);
							 }

							 resultLaiziData = [gameLogic.arrayConcatArray(resultLaiziData, temp)];
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 11://炸弹
					 {
						 var data = gameLogic.getPukerData(temp01);//[{value:"",sValue:"",sortNumber:"",laiziNumber:""}];
						 cc.log(JSON.stringify(data));
						 var laizi= gameLogic.getLaiziNumber(data);
						 if ( laizi.count > 0 && laizi.count < 4 )
						 {

							 resultLaiziData = [gameLogic.changeLaiziFour(data, laizi.count)];
						 }
						 else
						 {
							 //没有癞子
							 resultLaiziData = [temp01];
						 }
						 break;
					 }
					 case 12:
					 {
						 resultLaiziData = [temp01];
						 break;
					 }


					 default:
						 break;
					 }
					 cc.log("---------------------------resultLaiziData---------------------------")
					 cc.log("type = "+type+"  resultLaiziData= "+JSON.stringify(resultLaiziData));
					 cc.log("---------------------------resultLaiziData---------------------------")
					 return resultLaiziData
				 },

				 /**
				  * 赛选出飞机牌型中的单牌
				  * @param data
				  * @param cardId
				  */
				 removeCard:function(data, card)
				 {
					 var group = [], cardId = card.value;
					 if ( cardId && data && data.length > 0 )
					 {
						 for ( var i = 0; i < data.length; i++ )
						 {
							 if ( data[i].value != cardId )
							 {
								 group.push(data[i]);
							 }
						 }
						 return group;
					 }
					 else
					 {
						 return data;
					 }
				 },
				 /*
				  * 获得扑克牌1-k,鬼
				  * @param data 用户选择的卡牌服务器未处理牌数据
				  * @return {array}
				  */
				 getPukerData:function(data)
				 {
					 var cadLib = this.m_cbCardListData, cardArr = [];
					 var laiziValue = 0;
					 if ( sparrowDirector.gameData.laiziValue )
					 {
						 laiziValue = sparrowDirector.gameData.laiziValue;
					 }
					 for ( var i = 0; i < data.length; i++ )
					 {
						 //双鬼处理
						 if ( data[i] == 78 )
						 {
							 var obj = {};
							 obj.laiziNum = 0;
							 obj.sValue = 52;
							 obj.sortNumber = data[i];
							 obj.value = 78;
							 obj.sortTag  = 0;
							 cardArr.push(obj);
							 continue;
						 }
						 else if ( data[i] == 79 )
						 {
							 var obj = {};
							 obj.laiziNum = 0;
							 obj.sValue = 53;
							 obj.sortNumber = data[i];
							 obj.value = 79;
							 obj.sortTag  = 0;
							 cardArr.push(obj);
							 continue;
						 }

						 for ( var j = 0; j < cadLib.length; j++ )
						 {
							 if ( data[i] == cadLib[j] )
							 {
								 var obj = {};
								 obj.value  = j % 13 + 1;
								 obj.sValue = j;
								 obj.sortNumber = cadLib[j];
								 obj.laiziNum = 0;
								 obj.sortTag  = 0;
								 if ( obj.value == 1 )
								 {
									 //对A的特殊处理
									 obj.value = 14;
								 }
								 if ( obj.value == 2 && obj.sValue < 52 )
								 {
									 //对2的特殊处理
									 obj.value = 15;
								 }
								 if (laiziValue && obj.value == laiziValue.value )
								 {
									 obj.laiziNum = 1;
								 }
								 cardArr.push(obj);
							 }
						 }
					 }
					 cardArr.sort(function(a, b){return (a.value-b.value)});
					 return cardArr;
				 }
		});

var gameLogic = gameLogic || new CGameLogicLizi();
function SetGameLogic(bool)
{
	if ( bool )
	{
		gameLogic = new CGameLogicLizi();
	}
	else
	{
		gameLogic = new CGameLogic();
	}
}












