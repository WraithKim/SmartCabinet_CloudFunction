import * as cloudfunctions from 'firebase-functions';

const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

const db = admin.firestore();

// exports.deleteUser = functions.auth.user().onDelete((userRecord, context)=> {
//    //delete users/userID
//     db.collection('users/{').doc(userRecord.uid).delete();
//     //컬렉션 삭제 해야 함
// });

exports.deleteMemberInGroup = functions.firestore
    .document('users/{userID}/participated_group/{groupID}')
    .onDelete((snap, context) => {
        //group 안의 member에서 해당 유저 삭제
        db.collection('groups/' + context.params.groupID + '/member_ref').doc(context.params.userID).delete();
    });

exports.addCabinetToGroup = functions.firestore
    .document('cabinets/{cabinetID}/group_ref/{groupID}')
    .onCreate((snap, context) => {
        //cabinet가 가진 group_refo의 cabinet_refo에 해당 cabinet 추가
        db.collection('groups/' + context.params.groupID + '/cabinet_ref').doc(context.params.cabinetID).set({
            cabinet_ref : context.param.cabinetID
        });
    });

exports.deleteGroupInOwner = functions.firestore
    .document('cabinets/{groupID}')
    .onDelete((snap, context) => {
        //owner_ref의 participated_group에서 해당 group 삭제
        db.collection('users/' + snap.data().owner_ref + '/participated_group/').doc(context.params.groupID).delete();
    });

exports.deleteGroupInAdmin = functions.firestore
    .document('cabinets/{groupID}/admin_ref/{adminID}')
    .onDelete((snap, context) => {
        //adminID의 participated_group에서 해당 group 삭제
        db.collection('users/' + context.params.adminID + '/participated_group/').doc(context.params.groupID).delete();
    });

exports.deleteGroupInMember = functions.firestore
    .document('groups/{groupID}/member_ref/{memberID}')
    .onDelete((snap, context) => {
        //삭제된 user의 participated_group에서 해당 그룹 삭제
        db.collection('users/' + context.params.memberID + '/participated_group').doc(context.params.groupID).delete();
    });

exports.deleteCabinet = functions.firestore
    .document('groups/{groupID}/cabinet_ref/{cabinetID}')
    .onDelete((snap, context) => {
        //cabinet_ref에 속한 cabinet의 group_ref에서 해당 group 삭제
        db.collection('cabinets').doc(context.params.cabinetID).delete();
    });

exports.addGroupToMember = functions.firestore
    .document('groups/{groupID}/member_ref/{memberID}')
    .onCreate((snap, context) => {
        //group에 초대한 user의 participated_ref에 해당 group 추가
        db.collection('users/' + context.params.memberID + '/participated_group').doc(context.params.groupID).set({
            group_ref : context.params.groupID
        });
    });

exports.deleteMemberInGroup = functions.firestore
    .document('user/{userID}/participated_group/{group_ID}')
    .onDelete((snap, context) => {
        //user 탈퇴한 group의 member_ref에서 해당 user 삭제
        db.collection('groups/' + context.params.groupID + '/member_ref').doc(context.params.userID).delete();
    });