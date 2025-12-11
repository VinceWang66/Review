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

        //导航栏
        safari:{
            position: 'fixed' as const,
            top: 0,
            left: 0,
            width: '100%',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1000,
            padding: '12px 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
            boxSizing: 'border-box' as const,
        },

        //导航栏logo
        logo:{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1890ff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0, // 防止被压缩
            cursor: 'pointer'
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
        },

    //商品购买页面样式
        containerStyle : {
            display: 'flex',
            gap: '40px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '30px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        },
        leftPanelStyle : {
            flex: 1,
            paddingRight: '40px',
            borderRight: '1px solid #f0f0f0'
        },
        rightPanelStyle : {
            flex: 0.6,
            minWidth: '350px'
        },
        productNameStyle : {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#1890ff'
        },
        descriptionStyle : {
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#666',
            marginBottom: '24px'
        },
        categoryStyle : {
            fontSize: '14px',
            color: '#999'
        },
        priceSectionStyle : {
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0'
        },
        stockSectionStyle : {
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0'
        },
        quantitySectionStyle : {
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f0f0f0'
        },
        totalSectionStyle : {
            marginBottom: '30px',
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        buttonGroupStyle : {
            display: 'flex',
            flexDirection: 'column' as const,       
            gap: '12px'
        },
        errorStyle : {
            margin: '0 5% 20px 5%',
            padding: '12px',
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '6px',
            color: '#ff4d4f'
        },
        loadingStyle : {
            textAlign: 'center' as const,       
            padding: '40px',
            color: '#999'
        },
};