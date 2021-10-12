import React from "react";
import './about.less'
import globalColor from "@config/globalColor";


export default function ElgoAbout(){
    return (
        <div className="elgo-about">
            <span className="para"><span className="hi2">Hi</span>, 我是Neal，在新疆长大，在西安求学，毕业后留在了这座城市</span>
            <span className="para">2008年，加入老牌数据分析软件公司SPSS，任职软件工程师，2010年IBM收购了SPSS，我也一同加入了IBM，任职高级开发工程师</span>
            <span className="para">2015年，辞职创业，先后融资近200万，组建公司，带领团队，做了几款互联网产品，涉及微信体系，电商体系，餐饮体系，但运营不善，于2018年结束创业。</span>
            <span className="para">虽然创业结束，但是创业过程中的几个伙伴由于对技术的执着, 并没有分开，之后，大部分时间我们都在做自由职业，为一些中小企业提供技术咨询或软件外包服务。</span>
            <span className="para mt20">在自由职业，及松散团队的合作过程中，我和伙伴们需要保持高效的沟通，需要将项目/产品信息无差别的尽快触达到伙伴，合作方。虽然团队规模不大，但是从产品需求，UI设计，功能开发，测试管理到产品发布，每个环节都不能稀松马虎，这个过程中我们使用了很多开发工具来配合，但是最终不是需要多个工具切换共同使用，就是一些更适合大型团队做敏捷开发使用的重型工具,对于我们这种需要将精力更多的放在开发本身的中小团队并不合适</span>
            <span className="para">最终我们自己定义并开发了这款适合个人及中小团队的开发管理工具 <span className="strong">Elgo</span>.</span> <br/>
            <span className="para mt20"> <span className="hi mr10 ">Elgo</span>的愿景是帮助中小开发团队, 尽量抛开繁复的管理流程 (比如日报，站会)，将软件开发的必要生命周期在同一个系统里有序的串联起来，使得项目开发过程中不同参与者，不同角色可以通过最小量的沟通达到信息理解的一致性。</span>
            <span className="para mt20">Elgo 目前还在Beta的测试阶段，还没有对外开放，如果有小伙伴想体验，可以加我个人微信，索取注册邀请码, 微信号：<span className="strong" >neal5081</span> 请备注Elgo</span><br/>
            <span className="para">另外，如果有软件产品相关的技术合作，自由职业的探索，也欢迎来撩。</span>
        </div>
    )
}
