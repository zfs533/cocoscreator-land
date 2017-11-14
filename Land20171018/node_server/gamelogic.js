//逻辑类型
var CT_ERROR = 0;//错误类型
var CT_SINGLE = 1;//单牌类型
var CT_DOUBLE = 2;//对牌类型
var CT_THREE  = 3;//三条类型
var CT_SINGLE_LINE = 4; //单连类型（顺子）
var CT_DOUBLE_LINE = 5; //对连类型（连对）
var CT_THREE_LINE  = 6; //三连类型（飞机）
var CT_THREE_TAKE_ONE = 7; //三带一单
var CT_THREE_TAKE_TWO = 8; //三带一对
var CT_FOUR_TAKE_ONE  = 9; //四带两单
var CT_FOUR_TAKE_TWO  = 10; //四带两对
var CT_BOME_CARD      = 11; //炸弹类型
var CT_MISSILE_CARD   = 12; //火箭类型
//--------------------------------------------
var GameLogic = 
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
//		var temp = data.sort(function(a,b){return a.value-b.value;});//{value:1-13,sValue:1-53}
        switch ( temp.length )
        {
            case 1:
            {
                return CT_SINGLE;//单张
            }

            case 2:
            {
                if ( this.isSamecard(temp) )
                {
                    return CT_DOUBLE;//对子
                }
                else if( temp[0].sValue == 52 && temp[1].sValue == 53 )
                {
                    return CT_MISSILE_CARD;//王炸
                }
                else if ( temp[0].sValue == 53 && temp[1].sValue == 52 )
                {
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
            case CT_FOUR_TAKE_ONE://四带两单类型
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
                var resultData = this.getStright(data, s_data, true, bool);
                return resultData;
            }
            case CT_DOUBLE_LINE://连对类型
            {
                var resultData = this.getDoubleByDouble(data, s_data, true, bool);
                return resultData;
            }
            case CT_THREE_LINE://飞机类型
            {
                var resultData = this.getThreeByThree(data, s_data, true, bool);
                return resultData;
            }
            case CT_BOME_CARD://炸弹类型
            {
                var resultData = this.getFourCard(data, s_data, true);
                return resultData;
            }
//			case CT_MISSILE_CARD://火箭类型
//			{
//				var resultData = this.getMissile(data, s_data, true);
//				return resultData;
//			}
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
    getFourCard:function(data, s_data, is_add_king)
    {
        var dd = this.getBoom(data, s_data, is_add_king);
        return dd;
    },
    /**
     * 获取飞机
     * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
     * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
     * @param is_add_king 是否查找炸弹
     * @param bool 是否为滑动选牌
     * @returns {Array}
     */
    getThreeByThree:function(data, s_data, is_add_king, bool)
    {
        if ( !s_data || !data || s_data.length < 6 || data.length < 1){return [];}
        var newGroupData = [];
        var testData = [{"value":-13,"sValue":5},{"value":-13,"sValue":5},{"value":-13,"sValue":5}];
        //获取对方三带的牌
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
            type = 1;
        }
        else if ( o_three_length*3 == o_all_length )
        {
            type = 3;
        }
        else
        {
            type = 2;
        }
        var tempArr = [];
        for ( var i = 0; i < my_three.length; i++ )
        {
            item = my_three[i];
            if ( tempArr.length < 1 )
            {
                tempArr.push(item);
                continue;
            }
//			 if ( my_three[i-1][0].value != my_three[i][0].value )
            if ( Math.abs(my_three[i-1][0].value - my_three[i][0].value) == 1 )
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
            else if( bool )
            {
                //return [];
            }
        }
        temp = [];
        isP = true;
        var group = [];
        var reGroup = [];
        if ( type == 1 )//飞机带单牌
        {
            temp = data;
            for ( var i = 0; i < my_three.length; i++ )
            {
                //得到单牌
                temp = this.removeCard(temp, my_three[i][0]);
            }
            if ( my_three.length >= o_three.length && temp.length >= my_three.length )
            {
                if ( o_three.length == 2 )
                {
                    for ( var i = 1; i < my_three.length; i++ )
                    {
                        var mm = my_three[i-1];
                        var nn = my_three[i];
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
        }
        if ( bool ) {return newGroupData;}
        if ( is_add_king )
        {
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                group = this.arrayConcatArray(group, boom);
            }
        }
        return group;
    },
    /**
     * 获取连对
     * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
     * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
     * @param is_add_king 是否查找炸弹
     * @param bool 是否为滑动选牌
     * @returns {Array}
     */
    getDoubleByDouble:function(data, s_data, is_add_king, bool)
    {
        if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
        var newGroupData = [];
        var my_double = this.getDoubleCard(data, s_data, false);
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
                if (item[0].value != 15 && item[0].sValue != 52 && item[0].sValue != 53 )
                {
                    tempArr.push(item);
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
                for ( var p = 1; p < temp.length; p++ )
                {
                    var id1 = temp[p].value;
                    var id2 = temp[p-1].value;
                    if ( Math.abs(id1-id2) != 1 )
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
            else if( bool )
            {
                //return [];
            }
        }
        //if ( bool ) {return newGroupData;}
        if ( is_add_king )
        {
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
        }
        var len = s_data.length;
        (function()
        {
            for ( var i = 0; i < newGroupData.length; i++ )
            {
                if ( newGroupData[i].length > 4 )
                {
                    if ( newGroupData[i].length != len )
                    {
                        newGroupData.splice(i, 1);
                        arguments.callee();
                    }
                }
            }
        })();
        return newGroupData;
    },
    /**
     * 获取顺子
     * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
     * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
     * @param is_add_king 是否查找炸弹
     * @param bool 是否为滑动选牌
     * @returns {Array}
     */
    getStright:function(data, s_data, is_add_king, bool)
    {
        if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
        var newGroupData = [];

        var n_s_data = s_data;
        if ( data.length >= s_data.length )
        {
            n_s_data = s_data.sort(function(a,b){return a.value - b.value;});
            var min_id = n_s_data[0].value;
            var n_data = [];
            for ( var i = 0; i < data.length; i++ )
            {
                var n_id = data[i].value;
                if ( n_id > min_id )
                {
                    if ( data[i].sValue != 52 && data[i].sValue != 53 && data[i].value != 15 )
                    {
                        n_data.push(data[i]);
                    }
                }
            }
            //塞选出的牌长度小于其他玩家牌长度，查看是否有炸弹
            if ( n_data.length < n_s_data.length )
            {
                if ( bool ) {return newGroupData;}
                if ( is_add_king )
                {
                    var boom = this.getBoom(data, s_data, is_add_king);
                    if ( boom && boom.length > 0 )
                    {
                        Array.prototype.push.apply(newGroupData, boom);
                    }
                }
                return newGroupData;
            }
            //将塞选出的数据分组
            var groupData = this.groupData(n_data);
            if ( groupData.length < n_s_data.length )
            {
                if( bool ){return [];}
                if ( is_add_king )
                {
                    var boom = this.getBoom(data, s_data, is_add_king);
                    if ( boom && boom.length > 0 )
                    {
                        Array.prototype.push.apply(newGroupData, boom);
                    }
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
            arr = arr.sort(function(a,b){return a.value - b.value;});
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
                    newGroupData.push(n_item);
                }
            }
        }
        if ( bool ) {return newGroupData;}
        if ( is_add_king )
        {
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
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
            var testData = [{"value":0,"sValue":5},{"value":0,"sValue":5},{"value":0,"sValue":5}];
            //获取对方四带的牌
            var o_four = this.getBoom(s_data, null, false);
            //获取自己的四带牌
            var my_four = this.getBoom(data, o_four[0], false);
            //获取自己的对牌
            var myDouble  = this.getDoubleCard(data, testData, false);
            if ( myDouble.length >= 2 )
            {
                for ( var i = 0; i < my_four.length; i++ )
                {
                    var item = my_four[i];
                    var my_selectId = item[0].value;
                    var temp = [];
                    //将对牌选出
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
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
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
            //获取对方四带的牌
            var o_four = this.getBoom(s_data, null, false);
            //获取自己的四带牌
            var my_four = this.getBoom(data, o_four[0], false);
            data = this.groupData(data);
            for ( var i = 0; i < my_four.length; i++ )
            {
                var item = my_four[i];
                var my_selectId = item[0].value;
                var temp = [];
                //将单牌选出
                for ( var j = 0; j < data.length; j++ )
                {
                    var id = data[j][0].value;
                    if ( my_selectId != id )
                    {
                        temp.push(data[j][0]);
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
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
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
            var testData = [{"value":-1,"sValue":5},{"value":-1,"sValue":5},{"value":-1,"sValue":5}];
            //获取对方三带的牌
            var otherThreeArray = this.getThreeCard(s_data, testData, false);
            var selectID = otherThreeArray[0][0].value;
            //得到自己大于对方的三带牌
            var groupData = this.getThreeCard(data, otherThreeArray[0], false);
            //获取自己的对牌
            var myDouble  = this.getDoubleCard(data, testData, false, true);
            if ( myDouble.length < 1 )
            {
                myDouble = this.getDoubleCard(data, testData, false);
            }
            for ( var i = 0; i < groupData.length; i++ )
            {
                var item = groupData[i];
                var m_selectId = item[0].value;
                for ( var j = 0; j < myDouble.length; j++ )
                {
                    var item2 = myDouble[j];
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
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
        }
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
            var testData = [{"value":-1,"sValue":5},{"value":-1,"sValue":5},{"value":-1,"sValue":5}];
            //获取对方三带的牌
            var otherThreeArray = this.getThreeCard(s_data, testData, false);
            var selectID = otherThreeArray[0][0].value;
            //得到自己大于对方的三带牌
            var groupData = this.getThreeCard(data, otherThreeArray[0], false);
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
                        var arr = item;
                        arr.push(group[i][0]);
                        newGroupData.push(arr);
                    }
                }
            }

        }
        if ( is_add_king )
        {
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
        }
        return newGroupData;
    },
    /**
     * 获取三不带
     * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
     * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
     * @param is_add_king 是否查找炸弹
     * @returns {Array}
     */
    getThreeCard:function(data, s_data, is_add_king)
    {
        if ( !s_data || !data || s_data.length < 1 || data.length < 1){return [];}
        var newGroupData = [];
        if ( data.length >= s_data.length )
        {
            //将数据进行分组
            var groupData = this.groupData(data);
            groupData = groupData.sort(function(a,b){return a[0].value-b[0].value;});
            var selectID = s_data[1].value;
            for ( var i = 0; i < groupData.length; i++ )
            {
                var item = groupData[i];
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
                        item[0].sortTag = 1;
                        item[1].sortTag = 1;
                        item[2].sortTag = 1;
                        newGroupData.push([item[0], item[1], item[2]]);
                    }
                }
            }
        }
        if ( is_add_king )
        {
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
        }
        return newGroupData;
    },
    /**
     * 获取对牌
     * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
     * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
     * @param is_add_king 是否查找炸弹
     * @returns {Array}
     */
    getDoubleCard:function(data, s_data, is_add_king, isDouble)
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
                if ( isDouble )
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
            var boom = this.getBoom(data, s_data, is_add_king);
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroupData, boom);
            }
        }
        return newGroupData;
    },
    /**
     * 获取单牌
     * @param data [{value:1-13,sValue:1-53}]当前用户拥有的牌
     * @param s_data [{value:1-13,sValue:1-53}]上家打出的牌
     * @param is_add_king 是否查找炸弹
     * @returns {Array}
     */
    getSingleCard:function(data, s_data, is_add_king)
    {
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
            //大鬼或小鬼
            if ( (s_data[0].sValue == 52 || s_data[0].sValue == 53))
            {
                if ( (item[0].sValue == 53 || item[0].sValue == 52))
                {
                    if ( item.length == 1 && item[0].value > selectedId )
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
            if ( boom && boom.length > 0 )
            {
                Array.prototype.push.apply(newGroup, boom);
            }
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
            for ( var i = 0; i < data.length - 1; i++ )
            {
                if ( data[i].sValue == 52 || data[i+1].sValue == 53 || data[i].sValue == 53 || data[i+1].sValue == 52 )
                {
                    return false;
                }
                if ( data[i].value != data[i+1].value )
                {
                    return false;
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
        var groupData = this.groupData(data);
        if ( groupData.length > 2 ){return false;}
        var groupOne = [], groupTwo = [], groupThree = [], groupFour = [];
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
            else if ( groupData[i].length == 4 )
            {
                groupFour.push(groupData[i]);
            }
        }
        if ( groupFour.length > 0 ){return false;}
        if ( groupThree.length == 1 )
        {
            if ( groupTwo.length == 1 && groupOne.length == 0 ){return true;}
            if ( groupTwo.length == 0 && groupOne.length == 1 ){return true;}
            if ( groupTwo.length == 0 && groupOne.length == 0 ){return true;}
        }

        return false;
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
        for ( var i = 0; i < data.length; i++ )
        {
            //如果有A,2,大鬼，小鬼，则还回false
            if ( data[i].value == 1 || data[i].value == 2 || data[i].sValue == 52 || data[i].sValue == 53 )
            {
                return false;
            }
        }
        for ( var j = 1; j < data.length; j++ )
        {
            var value = data[j].value - data[j-1].value;
            if ( Math.abs(value) != 1 )
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
        var arr = [[],[],[]];
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
        }
        if ( data.length == 6 )//四带两单
        {
            if ( arr[0].length == 4 || arr[1].length == 4 || arr[2].length == 4 )
            {
                return true;
            }
        }
        else if ( data.length == 8 )//四带两对
        {
            var len1 = arr[0].length;
            var len2 = arr[1].length;
            var len3 = arr[2].length;
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
        var arr = [];
        var item = [];
        for ( var i = 0; i < data.length; i++ )
        {
            var card = data[i];
            if ( i % 2 == 0 )
            {
                //偶数个数创建一个新item
                item = [];
                item.push(card);
                arr.push(item);
            }
            else
            {
                //基数项和偶数项数值必须相同，（塞选出大鬼，小鬼）
                if ( item[0].value == card.value && card.sValue != 52 && card.sValue != 53 )
                {
                    item.push(card);
                }
            }
        }
        //数组个数不足三个
        if ( arr.length < 3 ) {return false;}
        var newArr = [];
        for ( var j = 0; j < arr.length; j++ )
        {
            item = arr[j];
            if ( item[0].value == 2 )
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
            //取其中一个装入新数组当中
            newArr.push(item[0]);
        }
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
        //将用户的牌进行分组
        var groupArray = this.groupData(data);
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
                return true;
            }
            else if ( (id2+id4) == 2*id3 )
            {
                return true;
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
     * 获取任意玩家牌中存在的，所有类型的扑克
     * @returns{array}
     */
    getRandomPuker:function(intelligentData)
    {
        var data = [], self = this;
        var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
        if ( intelligentData )
        {
            //智能提示
            currentPuker = intelligentData;
            return this.getRandomPukerHuadong(currentPuker);
        }
        for ( var m = 0; m < currentPuker.length; m++ )
        {
            data.push(currentPuker[m].sortNumber);
        }
        data = this.getPukerData(data);

        //单牌类型
        var rData01 = [];
        var r01= this.groupData(data);
        for ( var i = 0; i < r01.length; i++ )
        {
            if ( r01[i].length == 1 )
            {
                rData01.push(r01[i]);
            }
        }
        rData01.sort(function(a, b){return a[0].value-b[0].value});
        var s_data = [{value:0,sValue:0},{value:0,sValue:0}];
        var rData02 = this.getCardForType(data, s_data, 2, true);//对牌类型
        s_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
        var rData03 = this.getCardForType(data, s_data, 3, true);//三条类型
        s_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0}];
        var rData07 = this.getCardForType(data, s_data, 7, true);//三带一单
        s_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0},{value:1,sValue:0}];
        var rData08 = this.getCardForType(data, s_data, 8, true);//三带一对
        s_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0},{value:-1,sValue:0}];
        var rData09 = this.getCardForType(data, s_data, 9, true);//四带两单
        var rData010 = this.getCardForType(data, s_data, 10, true);//四带两对

        //单连类型（顺子）
        var sunLengtn = currentPuker.length;
        var s_data = []
        var rData04 = [];
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:0,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 4,true);
            if ( rData && rData.length > 0 )
            {
                rData04 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=5 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();

        var rData05 = [];//this.getCardForType(data, s_data, 5);//对连类型（连对）
        var sunLengtn = Math.floor(currentPuker.length/2);
        var s_data = []
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 5,true);
            if ( rData && rData.length > 0 )
            {
                rData05 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=3 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();

        var rData06 = [];//this.getCardForType(data, s_data, 6);//三连类型（飞机）
        var sunLengtn = Math.floor(currentPuker.length/3);
        var s_data = []
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 6,true);
            if ( rData && rData.length > 0 )
            {
                rData06 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=2 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();

        //s_data = [{value:-1,sValue:0},{value:-1,sValue:0},{value:-1,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0},{value:1,sValue:0}];
        var rData006 = [];//this.getCardForType(data, s_data, 6, true);//三连类型（飞机）
        var sunLengtn = Math.floor(currentPuker.length/3);
        var s_data = []
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
                s_data.push({value:1,sValue:0});
                s_data.push({value:1,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 6,true);
            if ( rData && rData.length > 0 )
            {
                rData006 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=2 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();




        s_data = [{value:-1,sValue:0},{value:-1,sValue:0},{value:-1,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:1,sValue:0},{value:1,sValue:0},{value:-2,sValue:0},{value:-2,sValue:0}];
        var rData0006 = [];//this.getCardForType(data, s_data, 6, true);//三连类型（飞机）
        var sunLengtn = Math.floor(currentPuker.length/3);
        var s_data = []
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
                s_data.push({value:1,sValue:0});
                s_data.push({value:1,sValue:0});
                s_data.push({value:-10,sValue:0});
                s_data.push({value:-10,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 6,true);
            if ( rData && rData.length > 0 )
            {
                rData0006 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=2 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();


        s_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
        var rData011 = this.getCardForType(data, s_data, 11, true);//炸弹类型

        var temp = [];
        if ( rData01.length > 0 )
        {
            temp.push(rData01.slice(0, 1));
        }
        if ( rData02.length > 0 )
        {
            temp.push(rData02.slice(0, 1));
        }
        if ( rData03.length > 0 )
        {
            temp.push(rData03.slice(0, 1));
        }
        if ( rData04.length > 0 )
        {
            temp.push(rData04.slice(0, 1));
        }
        if ( rData05.length > 0 )
        {
            temp.push(rData05.slice(0, 1));
        }
        if ( rData06.length > 0 )
        {
            temp.push(rData06.slice(0, 1));
        }
        if ( rData006.length > 0 )
        {
            temp.push(rData006.slice(0, 1));
        }
        if ( rData0006.length > 0 )
        {
            temp.push(rData0006.slice(0, 1));
        }
        if ( rData07.length > 0 )
        {
            temp.push(rData07.slice(0, 1));
        }
        if ( rData08.length > 0 )
        {
            temp.push(rData08.slice(0, 1));
        }
        if ( rData09.length > 0 )
        {
            temp.push(rData09.slice(0, 1));
        }
        if ( rData010.length > 0 )
        {
            temp.push(rData010.slice(0, 1));
        }
        if ( rData011.length > 0 )
        {
            temp.push(rData011.slice(0, 1));
        }
        return temp;
    },
    /**
     * 滑动出牌
     * @param intelligentData
     * @returns {Array}
     */
    getRandomPukerHuadong:function(currentPuker)
    {
        var dataT = [], self = this;
        for ( var m = 0; m < currentPuker.length; m++ )
        {
            dataT.push(currentPuker[m].sortNumber);
        }
        var data = this.getPukerData(dataT);

        //单连类型（顺子）
        var sunLengtn = currentPuker.length;
        var s_data = [];
        var rData04 = [];
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 4,true);
            if ( rData && rData.length > 0 )
            {
                rData04 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=5 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();

        var rData05 = [];//this.getCardForType(data, s_data, 5);//对连类型（连对）
        var sunLengtn = Math.floor(currentPuker.length/2);
        var s_data = [];
        !function()
        {
            if ( sunLengtn < 3 ){return [];}
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 5,true);
            if ( rData && rData.length > 0 )
            {
                rData05 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=3 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();

        var rData06 = [];//this.getCardForType(data, s_data, 6);//三连类型（飞机）
        var sunLengtn = Math.floor(currentPuker.length/3);
        var s_data = [];
        !function()
        {
            for ( var i = 0; i < sunLengtn; i++ )
            {
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
                s_data.push({value:-i,sValue:0});
            }
            var rData = self.getCardForType(data, s_data, 6,true);
            if ( rData && rData.length > 0 )
            {
                rData06 = rData;
                return rData;
            }
            else
            {
                s_data.splice(0);
                sunLengtn--;
                if ( sunLengtn >=2 )
                {
                    arguments.callee();
                }
                else
                {
                    return [];
                }
            }
        }();

        s_data = [{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0},{value:0,sValue:0}];
        var rData011 = this.getCardForType(data, s_data, 11, true);//炸弹类型

        var temp = [];

        if ( rData04.length > 0 )
        {
            temp.push(rData04.slice(0, 1));
        }
        if ( rData05.length > 0 )
        {
            temp.push(rData05.slice(0, 1));
        }
        if ( rData06.length > 0 )
        {
            temp.push(rData06.slice(0, 1));
        }
        if ( rData011.length > 0 )
        {
            temp.push(rData011.slice(0, 1));
        }
        if ( temp.length < 1 )
        {
            return [[currentPuker]];
        }
        if ( temp.length > 1 )
        {
            //排序，优先弹出点数差距较大的牌组[[[]]]
            temp.sort(function(a, b)
            {
                var mm = a[0][a.length] - a[0][0];
                var nn = b[0][b.length] - b[0][0];
                return nn - mm;
            });

        }
        return temp;
    },
    //获取所有顺子
    getAllSunzi:function(type)
    {
        var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
        var dataT = [], self = this;
        for ( var m = 0; m < currentPuker.length; m++ )
        {
            dataT.push(currentPuker[m].sortNumber);
        }
        var data = this.getPukerData(dataT);
        //单连类型（顺子）
        var s_data = this.getPukerData(sparrowDirector.gameData.oTherPuker);
        var rData04 = [];
        //!function()
        //{
        //    for ( var i = 0; i < len; i++ )
        //    {
        //        s_data.push({value:-i,sValue:0});
        //    }
            var rData = self.getCardForType(data, s_data, type,true);
            if ( rData && rData.length > 0 )
            {
                rData04.push(rData);
            }
        //}();
        return rData04;
    },
    //获取说有连对
    getAllDoubleSun:function(type)
    {
        var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
        var dataT = [], self = this;
        for ( var m = 0; m < currentPuker.length; m++ )
        {
            dataT.push(currentPuker[m].sortNumber);
        }
        var data = this.getPukerData(dataT);
        var rData05 = [];//this.getCardForType(data, s_data, 5);//对连类型（连对）
        //var sunLengtn = Math.floor(len/2);
        var s_data = this.getPukerData(sparrowDirector.gameData.oTherPuker);
        //!function()
        //{
        //    for ( var i = 0; i < sunLengtn; i++ )
        //    {
        //        s_data.push({value:-i,sValue:0});
        //        s_data.push({value:-i,sValue:0});
        //    }
            var rData = self.getCardForType(data, s_data, type,true);
            if ( rData && rData.length > 0 )
            {
                rData05.push(rData);
            }
        //}();
    },
    //获取所有飞机
    getAllThreeByThree:function(type)
    {
        var currentPuker = sparrowDirector.gameLayer.pukerLayer.pukerArr01;
        var dataT = [], self = this;
        for ( var m = 0; m < currentPuker.length; m++ )
        {
            dataT.push(currentPuker[m].sortNumber);
        }
        var data = this.getPukerData(dataT);
        var rData06 = [];//this.getCardForType(data, s_data, 6);//三连类型（飞机）
        //var sunLengtn = Math.floor(len/3);
        var s_data = this.getPukerData(sparrowDirector.gameData.oTherPuker);
        //!function()
        //{
        //    for ( var i = 0; i < sunLengtn; i++ )
        //    {
        //        s_data.push({value:-i,sValue:0});
        //        s_data.push({value:-i,sValue:0});
        //        s_data.push({value:-i,sValue:0});
        //    }
            var rData = self.getCardForType(data, s_data, type,true);
            if ( rData && rData.length > 0 )
            {
                rData06.push(rData);
            }
        //}();
        return rData06;
    },
    /**
     * 判断当前选择的牌是否可出（大于上家为可出，否则不能出）
     * @param data
     * @param s_data
     * @param type 牌的类型
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
                return this.getJugementResult01(data, s_data,type);
            }
            case 7://三带一单
            {
                return this.getJugementResult01(data, s_data,type);
            }
            case 8://三带一对
            {
                return this.getJugementResult01(data, s_data,type);
            }
            case 9: //四带两单
            {
                return this.getJugementResult01(data, s_data,type);
            }
            case 10://四带两对
            {
                return this.getJugementResult01(data, s_data,type);
            }
            case 11://炸弹类型
            {
                if ( data.length >=s_data.length )
                {
                    return true;
                }
                return this.getJugementResult01(data, s_data,type);
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
            group01.sort(function(a, b){return a[0].value - b[0].value});
            group02.sort(function(a, b){return a[0].value - b[0].value});
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
            if ( temp01[0].value > temp02[0].value )
            {
                return true;
            }
        }
        else if ( type == 9 || type == 10 )
        {
            var group01 = this.groupData(data);
            var group02 = this.groupData(s_data);
            group01.sort(function(a, b){return a[0].value - b[0].value});
            group02.sort(function(a, b){return a[0].value - b[0].value});
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
            data.sort(function(a, b){return a.value - b.value;});
            s_data.sort(function(a, b){return a.value - b.value;});
            if( data[0].value > s_data[0].value )
            {
                return true;
            }
            return false;
        }
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
                    obj.laiziNum = 0;
                    obj.value  = j % 13 + 1;
                    obj.sValue = j;
                    obj.sortNumber = cadLib[j];
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
                    cardArr.push(obj);
                }
            }
        }
        cardArr.sort(function(a, b){return (a.value-b.value)});
        return cardArr;
    }

}

exports.route = GameLogic;



















