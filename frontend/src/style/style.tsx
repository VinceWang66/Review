
export const Style = {
        
    //登录注册相关样式
        // 图标
        icon: {
          display: 'block',
          margin: '0 auto',
          fontSize: '128px',
          color: 'lightblue'
        },
        
        // 表单容器
        formContainer: {
          maxWidth: 512,
          margin: '0 auto',
          paddingTop: 20
        },
        
        // 输入框
        input: {
          marginTop: 12,
          width: '100%'
        },
        
        // 错误提示
        error: {
          color: 'red',
          fontSize: '16px',
          marginTop: '4px'
        },

        // 错误提示
        right: {
          color: 'green',
          fontSize: '16px',
          marginTop: '4px'
        },
        
        // 按钮容器
        buttonContainer: {
          display: 'flex',
          gap: 16,
          justifyContent: 'center',
          marginTop: 32
        },
        
        // 按钮
        button: {
          width: '32%'
        },
    
    //商品管理相关样式
        //覆盖项目css默认样式
        override:{
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            minHeight: '100vh',
            display: 'block'
        },

        //商品管理栏样式
        manager:{
            border: '2px solid lightgrey',
            padding:'10px',
            marginLeft:'5%',
            width: '90%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            marginTop: 20
        },

        //商品栏样式
        product:{
            padding: '20px',
            border: '1px solid #f0f0f0',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: '#fafafa'
        }
      };