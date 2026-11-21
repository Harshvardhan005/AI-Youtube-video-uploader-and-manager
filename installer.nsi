; AutoTube AI - Modern NSIS Installer Script
Unicode True

!include "MUI2.nsh"
!include "FileFunc.nsh"

; General Definitions
!define PRODUCT_NAME "AutoTube AI"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "AutoTube AI Team"
!define PRODUCT_WEB_SITE "https://github.com/Harshvardhan005/AI-Youtube-video-uploader-and-manager"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\AutoTube AI.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKCU"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "release\AutoTube-AI-Setup-1.0.0.exe"
InstallDir "$LOCALAPPDATA\Programs\AutoTube AI"
InstallDirRegKey HKCU "${PRODUCT_DIR_REGKEY}" ""
RequestExecutionLevel user
SetCompressor /SOLID lzma

; Interface Configuration
!define MUI_ABORTWARNING
!define MUI_HEADERIMAGE
!define MUI_WELCOMEFINISHPAGE_BITMAP_NOSTRETCH

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES

; Finish Page: Option to launch AutoTube AI
!define MUI_FINISHPAGE_RUN "$INSTDIR\AutoTube AI.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch AutoTube AI now"
!insertmacro MUI_PAGE_FINISH

; Uninstaller Pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Installer Section
Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite try

  ; Copy all files from win-unpacked
  File /r "release\win-unpacked\*.*"

  ; Create Desktop Shortcut
  CreateShortCut "$DESKTOP\AutoTube AI.lnk" "$INSTDIR\AutoTube AI.exe" "" "$INSTDIR\AutoTube AI.exe" 0

  ; Create Start Menu Shortcuts
  CreateDirectory "$SMPROGRAMS\AutoTube AI"
  CreateShortCut "$SMPROGRAMS\AutoTube AI\AutoTube AI.lnk" "$INSTDIR\AutoTube AI.exe" "" "$INSTDIR\AutoTube AI.exe" 0
  CreateShortCut "$SMPROGRAMS\AutoTube AI\Uninstall AutoTube AI.lnk" "$INSTDIR\Uninstall.exe" "" "$INSTDIR\Uninstall.exe" 0

  ; Write Uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"

  ; Registry entries for Add/Remove Programs
  WriteRegStr HKCU "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\AutoTube AI.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\AutoTube AI.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"

  ; Estimate size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

; Uninstaller Section
Section "Uninstall"
  ; Delete Shortcuts
  Delete "$DESKTOP\AutoTube AI.lnk"
  Delete "$SMPROGRAMS\AutoTube AI\AutoTube AI.lnk"
  Delete "$SMPROGRAMS\AutoTube AI\Uninstall AutoTube AI.lnk"
  RMDir "$SMPROGRAMS\AutoTube AI"

  ; Delete Program Files
  RMDir /r "$INSTDIR"

  ; Delete Registry Keys
  DeleteRegKey HKCU "${PRODUCT_DIR_REGKEY}"
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"

  SetAutoClose true
SectionEnd
