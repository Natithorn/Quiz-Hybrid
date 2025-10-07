import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import * as api from '../api';

export default function Feed({ token, onBack }: any) {
  const { width } = useWindowDimensions();
  const isSmall = width < 700;
  const [content, setContent] = useState('');
  const [statusId, setStatusId] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [statuses, setStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [classMembers, setClassMembers] = useState<any[]>([]);
  const [showClassMembers, setShowClassMembers] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  // ดึงข้อมูล status และ profile เมื่อโหลดหน้า
  useEffect(() => {
    loadStatuses();
    // โหลด profile เพื่อเก็บ email ของผู้ใช้ปัจจุบัน
    loadCurrentUserProfile();
  }, []);

  const loadCurrentUserProfile = async () => {
    try {
      const res = await api.getProfile();
      setCurrentUserEmail(res.data.email);
    } catch (err: any) {
      // ไม่แสดง error เพราะเป็น optional
    }
  };

  const loadStatuses = async () => {
    setLoading(true);
    try {
      const res = await api.getStatuses();
      setStatuses(res.data || []);
    } catch (err: any) {
      setMessage('Error loading statuses: ' + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  const doPost = async () => {
    setMessage('');
    try {
      const res = await api.postStatus(token, content);
      setMessage('Posted');
      setContent('');
      // try to extract id
      setStatusId(res && (res.id || res._id || res.statusId) ? (res.id || res._id || res.statusId) : '');
      // รีเฟรชรายการ status หลังจากโพสใหม่
      loadStatuses();
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const doComment = async () => {
    setMessage('');
    if (!statusId || statusId === 'string' || statusId.length < 10) {
      setMessage('Error: Please enter a valid Status ID');
      return;
    }
    if (!comment.trim()) {
      setMessage('Error: Please enter comment content');
      return;
    }
    try {
      const result = await api.postComment(token, statusId, comment);
      setMessage('Commented successfully');
      setComment('');
      // รีเฟรชรายการ status หลังจากคอมเมนต์
      await loadStatuses();
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const doLike = async (statusId: string) => {
    setMessage('');
    if (!statusId || statusId === 'string' || statusId.length < 10) {
      setMessage('Error: Please enter a valid Status ID');
      return;
    }
    try {
      await api.toggleLike(token, statusId);
      setMessage('Liked successfully');
      // รีเฟรชรายการ status หลังจาก like
      loadStatuses();
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const doUnlike = async (statusId: string) => {
    setMessage('');
    if (!statusId || statusId === 'string' || statusId.length < 10) {
      setMessage('Error: Please enter a valid Status ID');
      return;
    }
    try {
      await api.unlikeStatus(token, statusId);
      setMessage('Unliked successfully');
      // รีเฟรชรายการ status หลังจาก unlike
      loadStatuses();
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const doDelete = async (statusId: string) => {
    setMessage('');
    if (!statusId || statusId === 'string' || statusId.length < 10) {
      setMessage('Error: Please enter a valid Status ID');
      return;
    }
    try {
      await api.deleteStatus(statusId);
      setMessage('Status deleted successfully');
      // รีเฟรชรายการ status หลังจากลบ
      await loadStatuses();
    } catch (err: any) {
      setMessage('Error: ' + JSON.stringify(err));
    }
  };

  const loadProfile = async () => {
    try {
      const res = await api.getProfile();
      setProfile(res.data);
      setCurrentUserEmail(res.data.email); // เก็บ email ของผู้ใช้ปัจจุบัน
      setShowProfile(true);
    } catch (err: any) {
      setMessage('Error loading profile: ' + JSON.stringify(err));
    }
  };

  const loadClassMembers = async (year: string) => {
    try {
      const res = await api.getClassMembers(year);
      setClassMembers(res.data || []);
      setShowClassMembers(true);
    } catch (err: any) {
      setMessage('Error loading class members: ' + JSON.stringify(err));
    }
  };

  return (
    <View style={[styles.container, { paddingHorizontal: isSmall ? 12 : 24 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Button title="← กลับ" onPress={onBack} />
        <Text style={styles.title}>📱 Feed</Text>
        <View style={styles.headerActions}>
          <Button title="👥" onPress={() => loadClassMembers(selectedYear)} />
          <Button title="👤" onPress={loadProfile} />
          <Button title="🔄" onPress={loadStatuses} />
        </View>
      </View>

      {/* ส่วนเพิ่มโพส */}
      <View style={styles.postSection}>
        <Text style={styles.sectionTitle}>✍️ เขียนโพสใหม่</Text>
        <TextInput 
          placeholder="คุณกำลังคิดอะไรอยู่..." 
          value={content} 
          onChangeText={setContent} 
          style={styles.postInput} 
          multiline
          numberOfLines={3}
        />
        <Button title="📤 โพส" onPress={doPost} color="#007AFF" />
      </View>

      {/* ส่วนแสดงรายการ status */}
      <View style={styles.feedSection}>
        <Text style={styles.sectionTitle}>📰 โพสทั้งหมด ({statuses.length})</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>⏳ กำลังโหลด...</Text>
          </View>
        ) : (
          <ScrollView style={styles.statusList} showsVerticalScrollIndicator={false}>
            {statuses.map((status, index) => (
              <View key={status._id || index} style={styles.statusCard}>
                {/* Header ของโพส */}
                <View style={styles.statusHeader}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{status.createdBy?.email || 'Unknown'}</Text>
                    <Text style={styles.statusDate}>
                      {new Date(status.createdAt).toLocaleString('th-TH')}
                    </Text>
                  </View>
                </View>

                {/* เนื้อหาโพส */}
                <Text style={styles.statusContent}>{status.content}</Text>
                
                {/* ปุ่ม Like, Unlike, Comment และ Delete */}
                <View style={styles.statusActions}>
                  <Button 
                    title={`❤️ ${status.like?.length || 0}`} 
                    onPress={() => doLike(status._id)} 
                    color="#FF3B30"
                  />
                  <Button 
                    title={`💔 Unlike`} 
                    onPress={() => doUnlike(status._id)} 
                    color="#666"
                  />
                  <Text style={styles.commentCount}>
                    💬 {status.comment?.length || 0}
                  </Text>
                  {/* แสดงปุ่มลบเฉพาะโพสของตัวเอง */}
                  {currentUserEmail && status.createdBy?.email === currentUserEmail && (
                    <Button 
                      title="🗑️ ลบ" 
                      onPress={() => doDelete(status._id)} 
                      color="#FF3B30"
                    />
                  )}
                </View>

                {/* แสดงคอมเมนต์ */}
                {status.comment && status.comment.length > 0 && (
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>💬 คอมเมนต์</Text>
                    {status.comment.map((comment: any, commentIndex: number) => (
                      <View key={comment._id || commentIndex} style={styles.commentCard}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>{comment.createdBy?.email || 'Unknown'}</Text>
                          <Text style={styles.commentDate}>
                            {new Date(comment.createdAt).toLocaleString('th-TH')}
                          </Text>
                        </View>
                        <Text style={styles.commentContent}>{comment.content}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
            
            {statuses.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>📭 ยังไม่มีโพส</Text>
                <Text style={styles.emptySubtext}>ลองเขียนโพสแรกของคุณดูสิ!</Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Profile Modal */}
      {showProfile && profile && (
        <View style={styles.profileModal}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>👤 โปรไฟล์ของฉัน</Text>
              <Button title="✕" onPress={() => setShowProfile(false)} />
            </View>
            
            <View style={styles.profileContent}>
              <Text style={styles.profileField}>
                <Text style={styles.profileLabel}>ชื่อ:</Text> {profile.firstname} {profile.lastname}
              </Text>
              <Text style={styles.profileField}>
                <Text style={styles.profileLabel}>อีเมล:</Text> {profile.email}
              </Text>
              <Text style={styles.profileField}>
                <Text style={styles.profileLabel}>บทบาท:</Text> {profile.role}
              </Text>
              <Text style={styles.profileField}>
                <Text style={styles.profileLabel}>ประเภท:</Text> {profile.type}
              </Text>
              {profile.education && (
                <>
                  <Text style={styles.profileField}>
                    <Text style={styles.profileLabel}>สาขา:</Text> {profile.education.major}
                  </Text>
                  <Text style={styles.profileField}>
                    <Text style={styles.profileLabel}>รหัสนักศึกษา:</Text> {profile.education.studentId}
                  </Text>
                </>
              )}
              <Text style={styles.profileField}>
                <Text style={styles.profileLabel}>ยืนยันแล้ว:</Text> {profile.confirmed ? '✅' : '❌'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Class Members Modal */}
      {showClassMembers && (
        <View style={styles.profileModal}>
          <View style={styles.classMembersCard}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>👥 สมาชิกชั้นปี {selectedYear}</Text>
              <Button title="✕" onPress={() => setShowClassMembers(false)} />
            </View>
            
            <View style={styles.yearSelector}>
              <Text style={styles.yearLabel}>เลือกปีการศึกษา:</Text>
              <View style={styles.yearButtons}>
                {['2020', '2021', '2022', '2023', '2024', '2025'].map(year => (
                  <Button
                    key={year}
                    title={year}
                    onPress={() => {
                      setSelectedYear(year);
                      loadClassMembers(year);
                    }}
                    color={selectedYear === year ? '#007AFF' : '#666'}
                  />
                ))}
              </View>
            </View>

            <ScrollView style={styles.membersList} showsVerticalScrollIndicator={false}>
              {classMembers.map((member, index) => (
                <View key={member._id || index} style={styles.memberCard}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>
                      {member.firstname} {member.lastname}
                    </Text>
                    <Text style={styles.memberStatus}>
                      {member.confirmed ? '✅' : '❌'}
                    </Text>
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  {member.education && (
                    <View style={styles.memberEducation}>
                      <Text style={styles.memberField}>
                        <Text style={styles.memberLabel}>รหัสนักศึกษา:</Text> {member.education.studentId}
                      </Text>
                      <Text style={styles.memberField}>
                        <Text style={styles.memberLabel}>สาขา:</Text> {member.education.major}
                      </Text>
                      {member.education.school && (
                        <Text style={styles.memberField}>
                          <Text style={styles.memberLabel}>โรงเรียน:</Text> {member.education.school.name}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              ))}
              
              {classMembers.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>📭 ไม่พบสมาชิกในปี {selectedYear}</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Message */}
      {message ? (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f7fb',
    maxWidth: 900, 
    alignSelf: 'center' 
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700',
    color: '#1a1a1a',
  },
  
  // Post Section
  postSection: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12,
    color: '#1a1a1a',
  },
  postInput: { 
    borderWidth: 1, 
    borderColor: '#e0e0e0', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    textAlignVertical: 'top',
  },
  
  // Feed Section
  feedSection: { 
    flex: 1,
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusList: { 
    flex: 1,
  },
  
  // Status Cards
  statusCard: { 
    backgroundColor: '#fff', 
    padding: 16, 
    marginBottom: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statusHeader: {
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: { 
    fontSize: 14, 
    fontWeight: '600',
    color: '#1a1a1a',
  },
  statusDate: { 
    fontSize: 12, 
    color: '#666',
  },
  statusContent: { 
    fontSize: 16, 
    lineHeight: 22,
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statusActions: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentCount: { 
    fontSize: 14, 
    color: '#666',
    fontWeight: '500',
  },
  
  // Comments
  commentsSection: { 
    marginTop: 12, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0' 
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  commentCard: { 
    backgroundColor: '#f8f9fa', 
    padding: 12, 
    marginBottom: 8, 
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: { 
    fontSize: 12, 
    fontWeight: '600',
    color: '#1a1a1a',
  },
  commentDate: { 
    fontSize: 11, 
    color: '#999',
  },
  commentContent: { 
    fontSize: 14, 
    color: '#1a1a1a',
    lineHeight: 18,
  },
  
  // Loading & Empty States
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: { 
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: { 
    fontSize: 18,
    color: '#666', 
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  
  // Message
  messageContainer: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  message: { 
    color: '#2d5a2d',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Profile Modal
  profileModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  profileContent: {
    gap: 12,
  },
  profileField: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1a1a1a',
  },
  profileLabel: {
    fontWeight: '600',
    color: '#007AFF',
  },
  
  // Class Members
  classMembersCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 500,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  yearSelector: {
    marginBottom: 16,
  },
  yearLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  yearButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  membersList: {
    maxHeight: 400,
  },
  memberCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  memberStatus: {
    fontSize: 12,
  },
  memberEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  memberEducation: {
    gap: 4,
  },
  memberField: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  memberLabel: {
    fontWeight: '600',
    color: '#007AFF',
  },
  
  // Legacy
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 },
  smallBox: { padding: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 6 },
  col: { flexDirection: 'column' },
});
