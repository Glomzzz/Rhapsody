---
category: tech
date: 2024-12-08 02:33
tags:
  - NixOS
  - Linux
icon: /assets/icons/nixos.png
---

![](/assets/icons/rolling_girls.png)

# 谈谈我在NixOS上遇到的诸多及其解决方案！

关于如何安装，我觉得前人之述备矣。 
对于**NixOS**，除了磁盘分区那些硬的，几乎没有什么是不能装完了再做的。 
所以先装好——然后你就可以靠**NixOS**的可复现性：不用怕搞坏系统随便草了！

## Home Manager

### 某次switch后系统崩溃！


```bash
journalctl -xe -u home-manager-<your-username>.service
```
查日志找错误的根源即可

例如**HM**里**XDG**的首次启用会因文件冲突而崩溃，而只用把那些文件删掉即可。

### 环境变量 | home.sessionVariables

在启用了诸如KDE, GNOME等Graphical desktop后，你也许会遇到`home.sessionVariables`里配置的环境变量完全不奏效。

见 [`home.sessionVariables` has no effect when using a graphical desktop environment](https://github.com/nix-community/home-manager/issues/1011)

解决方案：

> NixOS Configuration

```nix
{username, ...}:{
  # To make sure that the home-manager session variables are loaded
  environment.extraInit = let 
      homeManagerSessionVars = "/etc/profiles/per-user/${username}/etc/profile.d/hm-session-vars.sh";
    in "[[ -f ${homeManagerSessionVars} ]] && source ${homeManagerSessionVars}";
}
```
## Fcitx5相关的输入法问题

### 无法正常通过`System Settings`配置

```
Could not load plugin from /nix/store/0ra30w31q506jqw18xm1njyzqqm0lp5f-fcitx5-configtool-5.1.7/lib/qt-5.15.15/plugins/plasma/kcms/systemsettings/kcm_fcitx5.so: The plugin '/nix/store/0ra30w31q506jqw18xm1njyzqqm0lp5f-fcitx5-configtool-5.1.7/lib/qt-5.15.15/plugins/plasma/kcms/systemsettings/kcm_fcitx5.so' uses incompatible Qt library. (5.15.0) [release]
```
你可以通过flakes去锁一些依赖的版本解决。

但其实你可以直接执行:

```bash
fcitx5-config-qt
```

来正常打开输入法配置界面


### 部分应用内输入法无法正常使用

例如 **Telegram Desktop**, **wechat-uos**.

大部分应用会在启动时检查环境变量中的 `XMODIFIERS` 中所指定的输入法并做兼容，像这样：

```bash
    if [[ ''${XMODIFIERS} =~ fcitx ]]; then
      export QT_IM_MODULE=fcitx
      export GTK_IM_MODULE=fcitx
    elif [[ ''${XMODIFIERS} =~ ibus ]]; then
      export QT_IM_MODULE=ibus
      export GTK_IM_MODULE=ibus
      export IBUS_USE_PORTAL=1
    fi
```

所以大部分情况是我们的环境变量中缺少`XMODIFIERS`导致的，

可以尝试在环境变量中写入以下内容:

> 以Home Manager为例
```
  home.sessionVariables = {
    XMODIFIERS = "@im=fcitx";
    GTK_IM_MODULE = "fcitx";
    QT_IM_MODULE = "fcitx";
  };
```


## 安装IntelliJ全家桶

见 [Jetbrains Tools](https://nixos.wiki/wiki/Jetbrains_Tools)

我选择全部用**JetBrains Toolbox**管理，以下是安装过程：
1. 安装 `pkgs.jetbrains-toolbox`
2. 启动一次**Toolbox**然后退出
3. 在 `~/.local/share/JetBrains/Toolbox/.storage.json` 添加 `"preferredKeychain": "linux-fallback"`
4. 启动**Toolbox**，点击登录，但网页出来后不要急，先点 **Troubleshoot...**，然后按其指示登录即可

这样你会通过**token**登录。

你还需要安装 `nix-ld` 以确保IDE可以被**Toolbox**启动：
 
```nix
{config, pkgs, ...}:{
  # For jetbrains IDEs  
    programs.nix-ld.enable = true;
    programs.nix-ld.libraries = with pkgs; [
        SDL
        SDL2
        SDL2_image
        SDL2_mixer
        SDL2_ttf
        SDL_image
        SDL_mixer
        SDL_ttf
        alsa-lib
        at-spi2-atk
        at-spi2-core
        atk
        bzip2
        cairo
        cups
        curlWithGnuTls
        dbus
        dbus-glib
        desktop-file-utils
        e2fsprogs
        expat
        flac
        fontconfig
        freeglut
        freetype
        fribidi
        fuse
        fuse3
        gdk-pixbuf
        glew110
        glib
        gmp
        gst_all_1.gst-plugins-base
        gst_all_1.gst-plugins-ugly
        gst_all_1.gstreamer
        gtk2
        harfbuzz
        icu
        keyutils.lib
        libGL
        libGLU
        libappindicator-gtk2
        libcaca
        libcanberra
        libcap
        libclang.lib
        libdbusmenu
        libdrm
        libgcrypt
        libgpg-error
        libidn
        libjack2
        libjpeg
        libmikmod
        libogg
        libpng12
        libpulseaudio
        librsvg
        libsamplerate
        libthai
        libtheora
        libtiff
        libudev0-shim
        libusb1
        libuuid
        libvdpau
        libvorbis
        libvpx
        libxcrypt-legacy
        libxkbcommon
        libxml2
        mesa
        nspr
        nss
        openssl
        p11-kit
        pango
        pixman
        python3
        speex
        stdenv.cc.cc
        tbb
        udev
        vulkan-loader
        wayland
        xorg.libICE
        xorg.libSM
        xorg.libX11
        xorg.libXScrnSaver
        xorg.libXcomposite
        xorg.libXcursor
        xorg.libXdamage
        xorg.libXext
        xorg.libXfixes
        xorg.libXft
        xorg.libXi
        xorg.libXinerama
        xorg.libXmu
        xorg.libXrandr
        xorg.libXrender
        xorg.libXt
        xorg.libXtst
        xorg.libXxf86vm
        xorg.libpciaccess
        xorg.libxcb
        xorg.xcbutil
        xorg.xcbutilimage
        xorg.xcbutilkeysyms
        xorg.xcbutilrenderutil
        xorg.xcbutilwm
        xorg.xkeyboardconfig
        xz
        zlib
    ];
    environment.systemPackages = config.programs.nix-ld.libraries;
}
```

## 关于开发环境

**Flakes**可以实现每个项目都环境隔离，你可以参考这两个repo

- [MordragT/nix-templates](https://github.com/MordragT/nix-templates)
- [the-nix-way/dev-templates](https://github.com/the-nix-way/dev-templates)

建议安装`direnv`，这样可以实现自动加载**Flakes**配置的项目环境

## 关于Nushell的命令补全

**Nushell**默认是没有命令补全的，但可以通过脚本做到： [nu_scripts](https://github.com/nushell/nu_scripts/tree/main/custom-completions)

于是我写了一个简单粗暴的自动塞所有**nu_scripts**中的补全脚本的**nix**:

> Home Manager Module
```nix
{username,pkgs,...}:
{
  home.packages = with pkgs; [
    nu_scripts
  ];
  programs.nushell = {
    enable = true;
    configFile.text = with builtins;
      let
        lib = pkgs.lib;
        completions = pkgs.nu_scripts.outPath + "/share/nu_scripts/custom-completions";
        
        flatten = lib.lists.flatten;

        isDir = path: pathExists path && readFileType path == "directory";
        isNuFile = path: match ".*\\.nu$" path != null;
        
        collectNuFiles = dir: 
          let
            getSubPaths = path: 
              map (name: "${dir}/${name}")
                  (filter (name: name != "auto-generate") (attrNames (readDir path)));
            helper = paths: 
              map (path: 
                    if      isNuFile path  then  path 
                    else if isDir    path  then  collectNuFiles path
                    else                         []
                  ) 
                  paths;
          in
            helper (getSubPaths dir);
        
        getNuFiles = flatten (collectNuFiles completions);

        processCompletions = concatStringsSep "\n" (
          map (path: "use ${path} *") getNuFiles
        );

      in
      ''
        $env.SHELL = "nu";
        $env.config.show_banner = false
        $env.config.filesize.metric = true

        let carapace_completer = {|spans|
        carapace $spans.0 nushell $spans | from json
        }
        $env.config = {
          show_banner: false,
          completions: {
            case_sensitive: false
            quick: true
            partial: true 
          }
        } 
        ${processCompletions}
      '';
    
    envFile.source = ./env.nu;
  };
}
```

